'use strict';

Ember.SimpleAuth.Stores.Cookie = Ember.Object.extend(Ember.Evented, {
  init: function() {
    this._cookiePrefix = 'ember_simple_auth:';
    this.syncProperties();
  },

  restore: function() {
    return this.knownCookies().map(function(property) {
      return this.load(property);
    });
  },

  load: function(property) {
    var value = document.cookie.match(new RegExp(this._cookiePrefix + property + '=([^;]+)')) || [];
    if (Ember.isEmpty(value)) {
      return undefined;
    } else {
      return decodeURIComponent(value[1] || '');
    }
  },

  save: function(properties) {
    //TODO: set cookie to secure if page served from HTTPS
    for (var property in properties) {
      var value = properties[property];
      if (Ember.isEmpty(value)) {
        document.cookie = this._cookiePrefix + property + '=; expires=' + (new Date(0)).toGMTString() + ';';
      } else {
        document.cookie = this._cookiePrefix + property + '=' + encodeURIComponent(value || '');
      }
    }
  },

  /**
    @method knownCookies
    @private
  */
  knownCookies: function() {
    var _this = this;
    return Ember.A(document.cookie.split(/[=;\s]+/)).filter(function(element) {
      return new RegExp('^' + _this._cookiePrefix).test(element)
    }).map(function(cookie) {
      return cookie.replace(_this._cookiePrefix, '');
    });
  },

  /**
    @method syncProperties
    @private
  */
  syncProperties: function() {
    var properties = {};
    var _this      = this;
    this.knownCookies().forEach(function(property) {
      properties[property] = _this.load(property);
    });
    this.trigger('updated_session_data', properties);
    if (!Ember.testing) {
      Ember.run.cancel(Ember.SimpleAuth.Stores.Cookie.__syncPropertiesTimeout);
      Ember.SimpleAuth.Stores.Cookie.__syncPropertiesTimeout = Ember.run.later(this, this.syncProperties, 500);
    }
  }
});
