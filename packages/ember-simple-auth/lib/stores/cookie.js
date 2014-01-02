'use strict';

Ember.SimpleAuth.Stores.Cookie = Ember.Object.extend(Ember.Evented, {
  cookiePrefix:           'ember_simple_auth:',
  secureCookies:          window.location.protocol === 'https:',
  _syncPropertiesTimeout: null,

  init: function() {
    this.syncProperties();
  },

  persist: function(properties) {
    for (var property in properties) {
      this.write(property, properties[property], null);
    }
    this._lastProperties = JSON.stringify(this.restore());
  },

  restore: function() {
    var _this      = this;
    var properties = {};
    this.knownCookies().forEach(function(cookie) {
      properties[cookie] = _this.read(cookie);
    });
    return properties;
  },

  clear: function() {
    var _this = this;
    this.knownCookies().forEach(function(cookie) {
      _this.write(cookie, null, (new Date(0)).toGMTString());
    });
  },

  read: function(name) {
    var value = document.cookie.match(new RegExp(this.cookiePrefix + name + '=([^;]+)')) || [];
    return decodeURIComponent(value[1] || '');
  },

  write: function(name, value, expiration) {
    var expires = Ember.isEmpty(expiration) ? '' : '; expires=' + expiration;
    var secure  = !!this.secureCookies ? ';secure' : '';
    document.cookie = this.cookiePrefix + name + '=' + encodeURIComponent(value) + expires + secure;
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
      this.trigger('ember-simple-auth:session-updated', properties);
    }
    if (!Ember.testing) {
      Ember.run.cancel(this._syncPropertiesTimeout);
      this._syncPropertiesTimeout = Ember.run.later(this, this.syncProperties, 500);
    }
  }
});
