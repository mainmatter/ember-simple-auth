import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import itBehavesLikeAStore from './shared/store-behavior';
import itBehavesLikeACookieStore from './shared/cookie-store-behavior';
import FakeCookieService from '../../helpers/fake-cookie-service';
import CookieStore from 'ember-simple-auth/session-stores/cookie';

class TestStoreBehavior extends CookieStore {
  _cookieName = 'test-session';
}

class TestCookieStoreBehavior extends CookieStore {
  _cookieName = 'test:session';
}

module('CookieStore', function (hooks) {
  setupTest(hooks);

  test('existing subclass setup properties do not replace store initialization', function (assert) {
    let initCalls = 0;
    let customSetupCalls = 0;
    this.owner.register('service:cookies', FakeCookieService);
    this.owner.register(
      'session-store:cookie',
      class ApplicationCookieStore extends CookieStore {
        _setupRan = true;

        init(...args) {
          initCalls++;
          super.init(...args);
        }

        _setup() {
          customSetupCalls++;
        }
      }
    );

    const store = this.owner.lookup('session-store:cookie');

    assert.strictEqual(initCalls, 1);
    assert.strictEqual(customSetupCalls, 0);
    assert.strictEqual(store._fastboot, this.owner.lookup('service:fastboot'));
  });

  module('StoreBehavior', function (hooks) {
    itBehavesLikeAStore({
      hooks,
      store(sinon, owner) {
        let store;
        let cookieService;
        owner.register('service:cookies', FakeCookieService);
        cookieService = owner.lookup('service:cookies');
        sinon.spy(cookieService, 'read');
        sinon.spy(cookieService, 'write');
        owner.register('session-store:cookie', TestStoreBehavior);
        store = owner.lookup('session-store:cookie');
        return store;
      },
      syncExternalChanges(store) {
        store._syncData();
      },
    });
  });

  module('CookieStoreBehavior', function (hooks) {
    itBehavesLikeACookieStore({
      hooks,
      store(sinon, owner, { cookie: klass } = {}) {
        owner.register('service:cookies', FakeCookieService);
        let cookieService = owner.lookup('service:cookies');
        sinon.spy(cookieService, 'read');
        sinon.spy(cookieService, 'write');
        owner.register('session-store:cookie', klass || TestCookieStoreBehavior);
        let store = owner.lookup('session-store:cookie');
        return store;
      },
      createStore(store) {
        return store;
      },
      renew(store, data) {
        return store._renew(data);
      },
      sync(store) {
        store._syncData();
      },
      spyRewriteCookieMethod(sinon, store) {
        sinon.spy(store, 'rewriteCookie');
        return store.rewriteCookie;
      },
    });
  });
});
