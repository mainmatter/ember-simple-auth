'use strict';

Ember.SimpleAuth.Stores.Cookie = Ember.Object.extend(Ember.Evented, {
  cookiePrefix:           'ember_simple_auth:',
  secureCookies:          window.location.protocol === 'https:',
  _syncPropertiesTimeout: null,

  init: function() {
    this.syncProperties();
  },

  persist: function(properties) {
    var secure = !!this.secureCookies ? ';secure' : '';
    for (var property in properties) {
      var value = properties[property];
      if (Ember.isEmpty(value)) {
        document.cookie = this.cookiePrefix + property + '=; expires=' + (new Date(0)).toGMTString() + secure;
      } else {
        document.cookie = this.cookiePrefix + property + '=' + encodeURIComponent(value || '') + secure;
      }
    }
  },

  restore: function() {
    var properties = {};
    var _this      = this;
    this.knownCookies().forEach(function(property) {
      var value = document.cookie.match(new RegExp(_this.cookiePrefix + property + '=([^;]+)')) || [];
      properties[property] = Ember.isEmpty(value) ? null : decodeURIComponent(value[1] || '');
    });
    return properties;
  },

  clear: function() {
    var nullifiedProperties = {};
    this.knownCookies().forEach(function(cookie) {
      nullifiedProperties[cookie] = null;
    });
    this.persist(nullifiedProperties);
  },

  /**
    @method knownCookies
    @private
  */
  knownCookies: function() {
    var _this = this;
    return Ember.A(document.cookie.split(/[=;\s]+/)).filter(function(element) {
      return new RegExp('^' + _this.cookiePrefix).test(element);
    }).map(function(cookie) {
      return cookie.replace(_this.cookiePrefix, '');
    });
  },

  /**
    @method syncProperties
    @private
  */
  syncProperties: function() {
    var properties        = this.restore();
    var encodedProperties = JSON.stringify(properties);
    if (encodedProperties !== this._lastProperties) {
      this._lastProperties = encodedProperties;
      this.trigger('ember-simple-auth:session_updated', properties);
    }
    if (!Ember.testing) {
      Ember.run.cancel(this._syncPropertiesTimeout);
      this._syncPropertiesTimeout = Ember.run.later(this, this.syncProperties, 500);
    }
  }
});
