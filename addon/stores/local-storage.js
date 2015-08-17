import Ember from 'ember';
import Base from './base';
import objectsAreEqual from '../utils/objects-are-equal';
import Configuration from '../configuration';

/**
  Store that saves its data in the browser's `localStorage`.

  _The factory for this store is registered as
  `'session-store:local-storage'` in Ember's container._

  __`Stores.LocalStorage` is Ember Simple Auth's default store.__

  @class LocalStorage
  @namespace Stores
  @module stores/local-storage
  @extends Stores.Base
  @public
*/
export default Base.extend({
  /**
    The key the store stores the data in.

    @property key
    @type String
    @default 'ember_simple_auth:session'
    @public
  */
  key: 'ember_simple_auth:session',

  /**
    @method init
    @private
  */
  init() {
    this.key = Configuration.localStorage.key;

    this.bindToStorageEvents();
  },

  /**
    Persists the `data` in the `localStorage`.

    @method persist
    @param {Object} data The data to persist
    @public
  */
  persist(data) {
    data = JSON.stringify(data || {});
    localStorage.setItem(this.key, data);
    this._lastData = this.restore();
  },

  /**
    Restores all data currently saved in the `localStorage` identified by the
    `keyPrefix` as one plain object.

    @method restore
    @return {Object} All data currently persisted in the `localStorage`
    @public
  */
  restore() {
    let data = localStorage.getItem(this.key);
    return JSON.parse(data) || {};
  },

  /**
    Clears the store by deleting all `localStorage` keys prefixed with the
    `keyPrefix`.

    @method clear
    @public
  */
  clear() {
    localStorage.removeItem(this.key);
    this._lastData = {};
  },

  /**
    @method bindToStorageEvents
    @private
  */
  bindToStorageEvents() {
    Ember.$(window).bind('storage', () => {
      let data = this.restore();
      if (!objectsAreEqual(data, this._lastData)) {
        this._lastData = data;
        this.trigger('sessionDataUpdated', data);
      }
    });
  }
});
