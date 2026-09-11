import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { computed, defineProperty, set } from '@ember/object';
import { createCache, getValue } from '@glimmer/tracking/primitives/cache';
import Configuration from 'ember-simple-auth/configuration';
import SessionService from 'ember-simple-auth/services/session';
import CookieStore from 'ember-simple-auth/session-stores/cookie';
import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';
import TestAuthenticator from 'ember-simple-auth/authenticators/test';
import FakeCookieService from '../helpers/fake-cookie-service';

function createSession(owner, Store) {
  owner.register('session-store:test', Store);
  owner.register('authenticator:test', TestAuthenticator);
  owner.register(
    'service:session',
    class ApplicationSession extends SessionService {
      createSessionStore(owner) {
        return new Store(owner);
      }

      createAuthenticators(owner) {
        return [new TestAuthenticator(owner)];
      }
    }
  );
  return owner.lookup('service:session');
}

class AdaptiveCookieStore extends AdaptiveStore {
  __isLocalStorageAvailable = false;
}

const updates = {
  assignment(store, value) {
    store.cookieExpirationTime = value;
  },
  'Ember.set'(store, value) {
    set(store, 'cookieExpirationTime', value);
  },
  '.set()'(store, value) {
    store.set('cookieExpirationTime', value);
  },
};

for (const useResolver of [true, false]) {
  module(`Session factory reactivity (useResolver: ${useResolver})`, function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
      this.owner.register(
        'config:environment',
        {
          ...this.owner.resolveRegistration('config:environment'),
          'ember-simple-auth': { useResolver },
        },
        { instantiate: false }
      );
      this.owner.register('service:cookies', FakeCookieService);
    });

    hooks.afterEach(function () {
      Configuration.load({});
    });

    for (const Store of [CookieStore, AdaptiveCookieStore]) {
      if (useResolver) {
        test(`${Store.name} updates existing computed consumers`, async function (assert) {
          assert.expect(7);
          const store = createSession(this.owner, Store).store;
          const consumer = { store };
          defineProperty(
            consumer,
            'rememberMe',
            computed('store.cookieExpirationTime', () => store.cookieExpirationTime !== null)
          );
          assert.false(consumer.rememberMe);

          for (const [method, update] of Object.entries(updates)) {
            update(store, 120);
            await settled();
            assert.true(consumer.rememberMe, `${method} invalidates the computed property`);

            update(store, null);
            await settled();
            assert.false(consumer.rememberMe);
          }
        });
      }

      for (const [method, update] of Object.entries(updates)) {
        test(`${Store.name} remember me updates through ${method}`, async function (assert) {
          const session = createSession(this.owner, Store);
          this.store = session.store;
          const rememberMe = createCache(() => this.store.cookieExpirationTime !== null);
          const cookies = this.owner.lookup('service:cookies');
          const expirationCookie = `${this.store.cookieName}-expiration_time`;
          await session.authenticate('authenticator:test', { token: 'secret' });
          const persisted = await this.store.restore();

          await render(hbs`<span data-test-expiry>{{this.store.cookieExpirationTime}}</span>`);
          assert.dom('[data-test-expiry]').hasText('');
          assert.false(getValue(rememberMe));

          update(this.store, 120);
          await settled();

          assert.strictEqual(this.store.cookieExpirationTime, 120);
          assert.true(getValue(rememberMe), 'invalidates cached derived state');
          assert.dom('[data-test-expiry]').hasText('120');
          assert.strictEqual(cookies.read(expirationCookie), '120', 'persists the expiration');
          assert.deepEqual(await this.store.restore(), persisted, 'preserves the session');

          update(this.store, null);
          await settled();

          assert.strictEqual(this.store.cookieExpirationTime, null);
          assert.false(getValue(rememberMe));
          assert.dom('[data-test-expiry]').hasText('');
          assert.strictEqual(cookies.read(expirationCookie), undefined, 'clears the expiration');
          assert.deepEqual(await this.store.restore(), persisted, 'preserves the session');
        });
      }
    }

    if (useResolver) {
      test('cookie properties supplied at creation preserve persistence callbacks', async function (assert) {
        this.owner.register('session-store:configured', CookieStore);
        const store = this.owner.factoryFor('session-store:configured').create({
          cookieName: 'initial-session',
          cookieExpirationTime: 120,
        });
        await store.persist({ token: 'secret' });

        store.cookieName = 'updated-session';
        await settled();

        assert.deepEqual(await store.restore(), { token: 'secret' });
        assert.strictEqual(store.cookieExpirationTime, 120);
        store.destroy();
      });
    }
  });
}
