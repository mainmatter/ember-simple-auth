/* jshint expr:true */
import { describe, beforeEach, afterEach } from 'mocha';
import sinon from 'sinon';
import Cookie from 'ember-simple-auth/session-stores/cookie';
import itBehavesLikeAStore from './shared/store-behavior';
import itBehavesLikeACookieStore from './shared/cookie-store-behavior';

describe('CookieStore', () => {
  let store;

  beforeEach(() => {
    store = Cookie.create();
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
    createStore(options) {
      return Cookie.create(options);
    },
    renew(store, data) {
      store._renew(data);
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
