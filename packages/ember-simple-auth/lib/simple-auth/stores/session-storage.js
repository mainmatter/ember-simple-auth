import Base from './base';
import objectsAreEqual from '../utils/objects-are-equal';
import Configuration from '../configuration';

/**
  Store that saves its data in the browser's `sessionStorage`.

  _The factory for this store is registered as
  `'simple-auth-session-store:session-storage'` in Ember's container._

  This store behaves much like the localStorage store, except that it uses the sessionStorage object,
  This means it will not persist beyond the life of the browser session

  @class SessionStorage
  @namespace SimpleAuth.Stores
  @module simple-auth/stores/session-storage
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
    this.key = Configuration.sessionStorageKey;

    this.bindToStorageEvents();
  },

  /**
    Persists the `data` in the `sessionStorage`.

    @method persist
    @param {Object} data The data to persist
  */
  persist: function(data) {
    data = JSON.stringify(data || {});
    sessionStorage.setItem(this.key, data);
    this._lastData = this.restore();
  },

  /**
    Restores all data currently saved in the `sessionStorage` identified by the
    `keyPrefix` as one plain object.

    @method restore
    @return {Object} All data currently persisted in the `sessionStorage`
  */
  restore: function() {
    var data = sessionStorage.getItem(this.key);
    return JSON.parse(data) || {};
  },

  /**
    Clears the store by deleting all `sessionStorage` keys prefixed with the
    `keyPrefix`.

    @method clear
  */
  clear: function() {
    sessionStorage.removeItem(this.key);
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
