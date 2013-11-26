'use strict';

Ember.SimpleAuth.Stores.Cookie = Ember.Object.extend(Ember.Evented, {
  init: function() {
    this.syncProperties();
  },
  restore: function() {
    return this.knownCookies.map(function(property) {
      return this.load(property);
    });
  },
  load: function(property) {
    var value = document.cookie.match(new RegExp(property + '=([^;]+)')) || [];
    if (Ember.isEmpty(value)) {
      return undefined;
    } else {
      return decodeURIComponent(value[1] || '');
    }
  },
  save: function(properties) {
    //TODO: set cookie to secure if page served from HTTPS
    for (var property in properties) {
      document.cookie = 'ember_simple_auth:' + property + '=' + encodeURIComponent(properties[property] || '');
    }
  },
  knownCookies: function() {
    return Ember.A(document.cookie.split(/[=;\s]+/)).filter(function(element) {
      return /^ember_simple_auth:/.test(element)
    }).map(function(cookie) {
      return cookie.replace('ember_simple_auth:', '');
    });
  }
  /**
    @method syncProperties
    @private
  */
  syncProperties: function() {
    var properties = {};
    var _this      = this;
    this._knownProperties.forEach(function(property) {
      properties[property] = _this.load(property);
    });
    this.trigger('updated_session_data', properties);
    if (!Ember.testing) {
      Ember.run.cancel(Ember.SimpleAuth.Stores.Cookie.__syncPropertiesTimeout);
      Ember.SimpleAuth.Stores.Cookie.__syncPropertiesTimeout = Ember.run.later(this, this._syncProperties, 500);
    }
  }
});
