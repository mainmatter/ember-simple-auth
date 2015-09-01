import Base from './base';
import objectsAreEqual from '../utils/objects-are-equal';
import Configuration from '../configuration';

/**
  Store that saves its data in the browser's `localStorage`.

  _The factory for this store is registered as
  `'simple-auth-session-store:local-storage'` in Ember's container._

  __`Stores.LocalStorage` is Ember Simple Auth's default store.__

  @class LocalStorage
  @namespace SimpleAuth.Stores
  @module simple-auth/stores/local-storage
  @extends Stores.Base
*/
export default Base.extend({
  /**
    The key the store stores the data in.

    @property key
    @type String
    @default 'ember_simple_auth:session'
  */
  key: 'ember_simple_auth:session',

  /**
    @method init
    @private
  */
  init: function() {
    this.key = Configuration.localStorageKey;

    this.bindToStorageEvents();
  },

  /**
    Persists the `data` in the `localStorage`.

    @method persist
    @param {Object} data The data to persist
  */
  persist: function(data) {
    data = JSON.stringify(data || {});

    // Prevent certain iOS Safari versions from crashing
    // in private browsing mode http://stackoverflow.com/a/14555361/483616
    try {
      localStorage.setItem(this.key, data);
    } catch(e) {}

    this._lastData = this.restore();
  },

  /**
    Restores all data currently saved in the `localStorage` identified by the
    `keyPrefix` as one plain object.

    @method restore
    @return {Object} All data currently persisted in the `localStorage`
  */
  restore: function() {
    var data = localStorage.getItem(this.key);
    return JSON.parse(data) || {};
  },

  /**
    Clears the store by deleting all `localStorage` keys prefixed with the
    `keyPrefix`.

    @method clear
  */
  clear: function() {
    localStorage.removeItem(this.key);
    this._lastData = {};
  },

  /**
    @method bindToStorageEvents
    @private
  */
  bindToStorageEvents: function() {
    var _this = this;
    Ember.$(window).bind('storage', function(e) {
      var data = _this.restore();
      if (!objectsAreEqual(data, _this._lastData)) {
        _this._lastData = data;
        _this.trigger('sessionDataUpdated', data);
      }
    });
  }
});
