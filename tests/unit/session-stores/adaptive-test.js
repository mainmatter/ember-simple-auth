import { describe, beforeEach, afterEach } from 'mocha';
import { it } from 'ember-mocha';
import { expect } from 'chai';
import Ember from 'ember';
import sinon from 'sinon';
import Adaptive from 'ember-simple-auth/session-stores/adaptive';
import itBehavesLikeAStore from './shared/store-behavior';
import itBehavesLikeACookieStore from './shared/cookie-store-behavior';

const { run } = Ember;

describe('AdaptiveStore', () => {
  let store;

  afterEach(() => {
    store.clear();
  });

  describe('when localStorage is available', () => {
    beforeEach(() => {
      store = Adaptive.create({ _isLocalStorageAvailable: true });
    });

    itBehavesLikeAStore({
      store() {
        return store;
      }
    });
  });

  describe('when localStorage is not available', () => {
    beforeEach(() => {
      store = Adaptive.create({ _isLocalStorageAvailable: false });
    });

    itBehavesLikeAStore({
      store() {
        return store;
      }
    });

    itBehavesLikeACookieStore({
      createStore(options = {}) {
        options._isLocalStorageAvailable = false;
        return Adaptive.create(options);
      },
      renew(store, data) {
        store.get('_store')._renew(data);
      },
      sync(store) {
        store.get('_store')._syncData();
      },
      spyRewriteCookieMethod(store) {
        sinon.spy(store.get('_store'), 'rewriteCookie');
        return store.get('_store').rewriteCookie;
      }
    });

    it('persists to cookie when cookie attributes change', () => {
      run(() => {
        let store = Adaptive.create({
          _isLocalStorageAvailable: false
        });
        store.persist({ key: 'value' });
        store.setProperties({
          cookieName:           'test:session',
          cookieExpirationTime: 60
        });
      });

      expect(document.cookie).to.contain('test:session-expiration_time=60');
    });
  });
});
