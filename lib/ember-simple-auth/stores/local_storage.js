var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import { Base } from './base';

/**
  Store that saves its data in the browser's `localStorage`.

  This store will trigger the `'ember-simple-auth:session-updated'` event when
  any of its keys is changed from another tab or window.

  @class LocalStorage
  @namespace EmberSimpleAuth.Stores
  @extends EmberSimpleAuth.Stores.Base
*/
var LocalStorage = Base.extend({
  /**
    The prefix to use for the store's keys so they can be distinguished from
    other keys.

    @property keyPrefix
    @type String
    @default 'ember_simple_auth:'
  */
  keyPrefix: 'ember_simple_auth:',

  /**
    @property _triggerChangeEventTimeout
    @private
  */
  _triggerChangeEventTimeout: null,

  /**
    @method init
    @private
  */
  init: function() {
    this.bindToStorageEvents();
  },

  /**
    Persists the `properties` in the `localStorage`.

    @method persist
    @param {Object} properties The properties to persist
  */
  persist: function(properties) {
    for (var property in properties) {
      var key = this.buildStorageKey(property);
      localStorage.setItem(key, properties[property]);
    }
    this._lastProperties = JSON.stringify(this.restore());
  },

  /**
    Restores all properties currently saved in the `localStorage` identified by
    the `keyPrefix`.

    @method restore
    @return {Object} All properties currently persisted in the session cookies
  */
  restore: function() {
    var _this = this;
    var properties = {};
    this.knownKeys().forEach(function(key) {
      var originalKey = key.replace(_this.keyPrefix, '');
      properties[originalKey] = localStorage.getItem(key);
    });
    return properties;
  },

  /**
    Clears the store by deleting all `localStorage` keys prefixed with the
    `keyPrefix`.

    @method clear
  */
  clear: function() {
    this.knownKeys().forEach(function(key) {
      localStorage.removeItem(key);
    });
    this._lastProperties = null;
  },

  /**
    @method buildStorageKey
    @private
  */
  buildStorageKey: function(property) {
    return this.keyPrefix + property;
  },

  /**
    @method knownKeys
    @private
  */
  knownKeys: function(callback) {
    var keys = Ember.A([]);
    for (var i = 0, l = localStorage.length; i < l; i++) {
      var key = localStorage.key(i);
      if (key.indexOf(this.keyPrefix) === 0) {
        keys.push(key);
      }
    }
    return keys;
  },

  /**
    @method bindToStorageEvents
    @private
  */
  bindToStorageEvents: function() {
    var _this = this;
    Ember.$(window).bind('storage', function(e) {
      var properties        = _this.restore();
      var encodedProperties = JSON.stringify(properties);
      if (encodedProperties !== _this._lastProperties) {
        _this._lastProperties = encodedProperties;
        Ember.run.cancel(_this._triggerChangeEventTimeout);
        _this._triggerChangeEventTimeout = Ember.run.next(_this, function() {
          this.trigger('ember-simple-auth:session-updated', properties);
        });
      }
    });
  }
});

export { LocalStorage };
