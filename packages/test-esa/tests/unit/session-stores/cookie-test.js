import { module } from 'qunit';
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
