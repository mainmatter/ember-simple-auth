import { describe, beforeEach } from 'mocha';
import sinonjs from 'sinon';
import itBehavesLikeAStore from './shared/store-behavior';
import itBehavesLikeACookieStore from './shared/cookie-store-behavior';
import FakeCookieService from '../../helpers/fake-cookie-service';
import createCookieStore from '../../helpers/create-cookie-store';

describe('CookieStore', () => {
  let sinon;
  let store;

  beforeEach(function() {
    sinon = sinonjs.createSandbox();
    store = createCookieStore(FakeCookieService.create());
  });

  afterEach(function() {
    sinon.restore();
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
