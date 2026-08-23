import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';
import sinonjs from 'sinon';
import itBehavesLikeAStore from './shared/store-behavior';
import itBehavesLikeACookieStore from './shared/cookie-store-behavior';
import FakeCookieService from '../../helpers/fake-cookie-service';
import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';
import LocalStorageStore from 'ember-simple-auth/session-stores/local-storage';
import CookieStore from 'ember-simple-auth/session-stores/cookie';
import { setupStore } from 'ember-simple-auth/session-stores/base';
import Configuration from 'ember-simple-auth/configuration';

module('AdaptiveStore', function (hooks) {
  setupTest(hooks);

  module('when localStorage is available', function (hooks) {
    itBehavesLikeAStore({
      hooks,
      store(sinon, owner) {
        let cookieService;
        owner.register('service:cookies', FakeCookieService);
        cookieService = owner.lookup('service:cookies');
        sinon.spy(cookieService, 'read');
        sinon.spy(cookieService, 'write');

        owner.register(
          'session-store:adaptive',
          class TestAdaptiveStorage extends AdaptiveStore {
            __isLocalStorageAvailable = true;
          }
        );
        return owner.lookup('session-store:adaptive');
      },
    });
  });

  module('when localStorage is not available', function (hooks) {
    itBehavesLikeAStore({
      hooks,
      store(sinon, owner) {
        let cookieService;
        owner.register('service:cookies', FakeCookieService);
        cookieService = owner.lookup('service:cookies');
        sinon.spy(cookieService, 'read');
        sinon.spy(cookieService, 'write');
        owner.register(
          'session-store:adaptive',
          class TestAdaptiveStorage extends AdaptiveStore {
            __isLocalStorageAvailable = false;
            _cookieName = 'test:session';
          }
        );
        return owner.lookup('session-store:adaptive');
      },
    });
  });

  module('CookieStore', function () {
    module('Behaviour', function (hooks) {
      itBehavesLikeACookieStore({
        hooks,
        store(sinon, owner, { adaptive: klass } = {}) {
          owner.register('service:cookies', FakeCookieService);
          let cookieService = owner.lookup('service:cookies');
          sinon.spy(cookieService, 'read');
          sinon.spy(cookieService, 'write');
          owner.register(
            'session-store:adaptive',
            klass ||
              class TestAdaptiveStorage extends AdaptiveStore {
                __isLocalStorageAvailable = false;
                _cookieName = 'test:session';
              }
          );
          return owner.lookup('session-store:adaptive');
        },
        renew(store, data) {
          return store.get('_store')._renew(data);
        },
        sync(store) {
          store.get('_store')._syncData();
        },
        spyRewriteCookieMethod(sinon, store) {
          sinon.spy(store.get('_store'), 'rewriteCookie');
          return store.get('_store').rewriteCookie;
        },
      });
    });

    test('persists to cookie when cookie attributes change', async function (assert) {
      let sinon = sinonjs.createSandbox();
      let store;
      let cookieService;
      let now;

      this.owner.register('service:cookies', FakeCookieService);
      cookieService = this.owner.lookup('service:cookies');
      sinon.spy(cookieService, 'read');
      sinon.spy(cookieService, 'write');
      run(() => {
        now = new Date();
        this.owner.register(
          'session-store:adaptive',
          class TestAdaptiveStorage extends AdaptiveStore {
            __isLocalStorageAvailable = false;
            _cookieName = 'test:session';
          }
        );
        store = this.owner.lookup('session-store:adaptive');

        store.setProperties({
          cookieName: 'test:session',
          cookieExpirationTime: 60,
          sameSite: 'Strict',
        });
      });
      await store.persist({ key: 'value' });

      assert.ok(
        cookieService.write.calledWith(
          'test:session-expiration_time',
          60,
          sinon.match(function ({ domain, expires, path, secure, sameSite }) {
            return (
              domain === null &&
              path === '/' &&
              secure === false &&
              expires >= new Date(now.getTime() + 60 * 1000) &&
              sameSite === 'Strict'
            );
          })
        )
      );
    });
  });

  module('useResolver', function (hooks) {
    hooks.afterEach(function () {
      Configuration.load({});
    });

    test('constructs LocalStorageStore when the flag is false', function (assert) {
      Configuration.load({ useResolver: false });
      this.owner.register('service:cookies', FakeCookieService);

      class TestAdaptiveStore extends AdaptiveStore {
        __isLocalStorageAvailable = true;
      }
      let store = setupStore(new TestAdaptiveStore(this.owner));

      assert.ok(store.get('_store') instanceof LocalStorageStore);
    });

    test('constructs CookieStore when the flag is false', function (assert) {
      Configuration.load({ useResolver: false });
      this.owner.register('service:cookies', FakeCookieService);

      class TestAdaptiveStore extends AdaptiveStore {
        __isLocalStorageAvailable = false;
      }
      let store = setupStore(new TestAdaptiveStore(this.owner));

      assert.ok(store.get('_store') instanceof CookieStore);
    });
  });
});
