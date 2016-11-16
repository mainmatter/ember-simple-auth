import Ember from 'ember';
import { describe, beforeEach, afterEach } from 'mocha';
import Adaptive from 'ember-simple-auth/session-stores/adaptive';
import itBehavesLikeAStore from './shared/store-behavior';
import itBehavesLikeACookieStore from './shared/cookie-store-behavior';
import FakeCookieService from '../../helpers/fake-cookie-service';

const { assign: emberAssign, merge } = Ember;
const assign = emberAssign || merge;

describe('AdaptiveStore', () => {
  let store;

  afterEach(() => {
    store.clear();
  });

  describe('when localStorage is available', () => {
    beforeEach(() => {
      store = Adaptive.extend({
        _createStore(storeType, options) {
          return this._super(storeType, assign(options, { _isFastBoot: false }));
        }
      }).create({
        _isLocalStorageAvailable: true
      });
    });

    itBehavesLikeAStore({
      store() {
        return store;
      }
    });
  });

  describe('when localStorage is not available', () => {
    beforeEach(() => {
      let cookieService = FakeCookieService.create();
      store = Adaptive.extend({
        _cookies: cookieService,
        _fastboot: { isFastBoot: false },

        _createStore(storeType, options) {
          return this._super(storeType, assign({}, options, { _isFastBoot: false }));
        }
      }).create({
        _isLocalStorageAvailable: false
      });
    });

    itBehavesLikeAStore({
      store() {
        return store;
      }
    });

    itBehavesLikeACookieStore({
      createStore(cookieService, options = {}) {
        options._isLocalStorageAvailable = false;
        return Adaptive.extend({
          _cookies: cookieService,
          _fastboot: { isFastBoot: false },

          _createStore(storeType, options) {
            return this._super(storeType, assign({}, options, { _isFastBoot: false }));
          }
        }).create(options);
      },
      renew(store, data) {
        store.get('_store')._renew(data);
      },
      sync(store) {
        store.get('_store')._syncData();
      }
    });
  });
});
