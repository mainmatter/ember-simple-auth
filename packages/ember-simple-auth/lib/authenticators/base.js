'use strict';

Ember.SimpleAuth.Authenticators.Base = Ember.Object.extend(Ember.Evented, {
  restore: function(properties) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(properties.authToken)) {
        resolve(properties);
      } else {
        reject();
      }
    });
  },

  authenticate: function(credentials) {
  },

  invalidate: function() {
    return new Ember.RSVP.Promise(function(resolve) { resolve(); });
  }
});
