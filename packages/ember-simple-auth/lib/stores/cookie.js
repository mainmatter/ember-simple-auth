'use strict';

Ember.SimpleAuth.Stores.Cookie = Ember.Object.extend(Ember.Evented, {
  cookiePrefix:          'ember_simple_auth:',
  secureCookies:         window.location.protocol === 'https:',
  syncPropertiesTimeout: null,

  init: function() {
    this.syncProperties();
  },

  restore: function() {
    return this.loadAll();
  },

  clear: function() {
    var nullifiedProperties = {};
    this.knownCookies().forEach(function(cookie) {
      nullifiedProperties[cookie] = undefined;
    });
    this.save(nullifiedProperties);
  },

  load: function(property) {
    var value = document.cookie.match(new RegExp(this.get('cookiePrefix') + property + '=([^;]+)')) || [];
    if (Ember.isEmpty(value)) {
      return undefined;
    } else {
      return decodeURIComponent(value[1] || '');
    }
  },

  save: function(properties) {
    var secure = !!this.get('secureCookies') ? ';secure' : ''
    for (var property in properties) {
      var value = properties[property];
      if (Ember.isEmpty(value)) {
        document.cookie = this.get('cookiePrefix') + property + '=; expires=' + (new Date(0)).toGMTString() + secure;
      } else {
        document.cookie = this.get('cookiePrefix') + property + '=' + encodeURIComponent(value || '') + secure;
      }
    }
  },

  loadAll: function() {
    var properties = {};
    var _this      = this;
    this.knownCookies().forEach(function(property) {
      properties[property] = _this.load(property);
    });
    return properties;
  },

  /**
    @method knownCookies
    @private
  */
  knownCookies: function() {
    var _this = this;
    return Ember.A(document.cookie.split(/[=;\s]+/)).filter(function(element) {
      return new RegExp('^' + _this.get('cookiePrefix')).test(element)
    }).map(function(cookie) {
      return cookie.replace(_this.get('cookiePrefix'), '');
    });
  },

  /**
    @method syncProperties
    @private
  */
  syncProperties: function() {
    var properties = this.loadAll();
    this.trigger('updated_session_data', properties);
    if (!Ember.testing) {
      Ember.run.cancel(this.get('syncPropertiesTimeout'));
      this.set('syncPropertiesTimeout', Ember.run.later(this, this.syncProperties, 500));
    }
  }
});
