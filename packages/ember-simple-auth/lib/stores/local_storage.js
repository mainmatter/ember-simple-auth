'use strict';

Ember.SimpleAuth.Stores.LocalStorage = Ember.Object.extend(Ember.Evented, {
  storageKeyPrefix: 'ember_simple_auth:',

  init: function() {
    this.listenToStorageEvents();
  },

  restore: function() {
    return this.loadAll();
  },

  clear: function() {
    this.knownKeys().forEach(function(key) {
      localStorage.removeItem(key);
    });
  },

  load: function(property) {
    return localStorage.getItem(this.buildStorageKey(property));
  },

  save: function(properties) {
    for (var property in properties) {
      var key = this.buildStorageKey(property);
      var value = properties[property];
      if (Ember.isEmpty(value)) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    }
  },

  /**
    @method buildStorageKey
    @private
  */
  buildStorageKey: function(property) {
    return this.get('storageKeyPrefix') + property;
  },

  /**
    @method knownKeys
    @private
  */
  knownKeys: function(callback) {
    var keys = [];
    for (var i = 0, l = localStorage.length; i < l; i++) {
      var key = localStorage.key(i);
      if (key.indexOf(this.get('storageKeyPrefix')) === 0) {
        keys.push(key);
      }
    }
    return Ember.A(keys);
  },

  loadAll: function() {
    var _this = this;
    var properties = {};
    this.knownKeys().forEach(function(key) {
      var originalKey = key.replace(_this.get('storageKeyPrefix'), '');
      properties[originalKey] = localStorage.getItem(key);
    });
    return properties;
  },

  listenToStorageEvents: function() {
    var _this = this;
    Ember.$(window).bind('storage', function() {
      var properties = _this.loadAll();
      this.trigger('updated_session_data', properties);
    });
  }
});
