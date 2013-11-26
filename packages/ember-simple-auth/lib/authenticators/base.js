'use strict';

Ember.SimpleAuth.Authenticators.Base = Ember.Object.extend(Ember.Evented, {
  restore: function(properties) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve) {
      if (!Ember.isEmpty(properties.authToken)) {
        _this._handleAuthTokenRefresh(properties.authTokenExpiry, properties.refreshToken);
        resolve(properties);
      } else {
        reject();
      }
    });
  },
});
