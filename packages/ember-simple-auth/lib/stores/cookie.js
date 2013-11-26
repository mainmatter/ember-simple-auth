'use strict';

Ember.SimpleAuth.Stores.Cookie = Ember.Object.extend(Ember.Evented, {
  init: function() {
    this.syncProperties();
  },
  restore: function() {
    //TODO: load all properties of ember-simple-auth (for cooke store use prefix, for sessionStorage/localStorage use dedicated property etc.)
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
      document.cookie = property + '=' + encodeURIComponent(properties[property] || '');
    }
  },
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
