/* jshint expr:true */
import { describe, beforeEach, afterEach } from 'mocha';
import sinon from 'sinon';
import Cookie from 'ember-simple-auth/session-stores/cookie';
import itBehavesLikeAStore from './shared/store-behavior';
import itBehavesLikeACookieStore from './shared/cookie-store-behavior';
import FakeCookieService from '../../helpers/fake-cookie-service';

function createCookieStore(cookiesService, options = {}) {
  options._cookies = cookiesService;
  options._fastboot = { isFastBoot: false };
  return Cookie.create(options);
}

describe('CookieStore', () => {
  let store;

  beforeEach(() => {
    store = createCookieStore(FakeCookieService.create());
  });

  afterEach(() => {
    store.clear();
  });

  itBehavesLikeAStore({
    store() {
      return store;
    },
    syncExternalChanges() {
      store._syncData();
    }
  });

  itBehavesLikeACookieStore({
    createStore(cookiesService, options = {}) {
      return createCookieStore(cookiesService, options);
    },
    renew(store, data) {
      return store._renew(data);
    },
    sync(store) {
      store._syncData();
    },
    spyRewriteCookieMethod(store) {
      sinon.spy(store, 'rewriteCookie');
      return store.rewriteCookie;
    }
  });
});
