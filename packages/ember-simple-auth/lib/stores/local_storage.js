'use strict';

Ember.SimpleAuth.Stores.LocalStorage = Ember.Object.extend(Ember.Evented, {
  storageKeyPrefix: 'ember_simple_auth:',

  init: function() {
    this.bindToStorageEvents();
  },

  persist: function(properties) {
    for (var property in properties) {
      var key = this.buildStorageKey(property);
      localStorage.setItem(key, properties[property]);
    }
  },

  restore: function() {
    var _this = this;
    var properties = {};
    this.knownKeys().forEach(function(key) {
      var originalKey = key.replace(_this.storageKeyPrefix, '');
      properties[originalKey] = localStorage.getItem(key);
    });
    return properties;
  },

  clear: function() {
    this.knownKeys().forEach(function(key) {
      localStorage.removeItem(key);
    });
  },

  /**
    @method buildStorageKey
    @private
  */
  buildStorageKey: function(property) {
    return this.storageKeyPrefix + property;
  },

  /**
    @method knownKeys
    @private
  */
  knownKeys: function(callback) {
    var keys = Ember.A([]);
    for (var i = 0, l = localStorage.length; i < l; i++) {
      var key = localStorage.key(i);
      if (key.indexOf(this.storageKeyPrefix) === 0) {
        keys.push(key);
      }
    }
    return keys;
  },

  bindToStorageEvents: function() {
    var _this = this;
    Ember.$(window).bind('storage', function() {
      var properties = _this.restore();
      this.trigger('ember-simple-auth:session-updated', properties);
    });
  }
});
