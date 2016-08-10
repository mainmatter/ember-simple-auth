import { describe, beforeEach, afterEach } from 'mocha';
import Adaptive from 'ember-simple-auth/session-stores/adaptive';
import itBehavesLikeAStore from './shared/store-behavior';
import itBehavesLikeACookieStore from './shared/cookie-store-behavior';
import { it } from 'ember-mocha';
import { expect } from 'chai';
import Ember from 'ember';
import sinon from 'sinon';

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
      spyRewriteCookieMethod() {
        return sinon.spy(store.get('_store'), 'rewriteCookie');
      },
      unspyRewriteCookieMethod() {
        return store.get('_store').rewriteCookie.restore();
      }
    });

    it('persists to cookie when cookie attributes change', () => {
      run(() => {
        let store = Adaptive.create({
          _isLocalStorageAvailable: false
        });
        store.setProperties({
          cookieName: 'test:session',
          cookieExpirationTime: 60
        });
      });
      expect(document.cookie).to.contain('test:session-expiration_time=60');
    });
  });
});
