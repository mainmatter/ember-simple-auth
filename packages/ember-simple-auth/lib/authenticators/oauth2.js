'use strict';

Ember.SimpleAuth.Authenticators.OAuth2 = Ember.SimpleAuth.Authenticators.Base.extend({
  authenticate: function(credentials) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var postData = ['grant_type=password', 'username=' + credentials.identification, 'password=' + credentials.password].join('&');
      Ember.$.ajax(Ember.SimpleAuth.Authenticators.OAuth2.serverTokenEndpoint, {
        type:        'POST',
        data:        postData,
        contentType: 'application/x-www-form-urlencoded'
      }).then(function(response) {
        _this._handleAuthTokenRefresh(response.expiry, response.refresh_token);
        resolve({ authToken: response.access_token });
      }, function(xhr, status, error) {
        reject(xhr.responseText]);
      });
    });
  },
  unauthenticate: function() {
    Ember.run.cancel(Ember.SimpleAuth.Authenticators.OAuth2.autoRefreshToken._refreshTokenTimeout);
    delete Ember.SimpleAuth.Authenticators.OAuth2.autoRefreshToken._refreshTokenTimeout;
    return Ember.RSVP.resolve({ authToken: undefined });
  },
  handleAuthTokenRefresh: function(authTokenExpiry, refreshToken) {
    if (Ember.SimpleAuth.Authenticators.OAuth2.autoRefreshToken) {
      Ember.run.cancel(Ember.SimpleAuth.Authenticators.OAuth2.autoRefreshToken._refreshTokenTimeout);
      delete Ember.SimpleAuth.Authenticators.OAuth2.autoRefreshToken._refreshTokenTimeout;
      var waitTime = (authTokenExpiry || 0) * 1000 - 5000;
      if (!Ember.isEmpty(refreshToken) && waitTime > 0) {
        Ember.SimpleAuth.Authenticators.OAuth2.autoRefreshToken._refreshTokenTimeout = Ember.run.later(this, function() {
          var _this = this;
          Ember.$.ajax(Ember.SimpleAuth.Authenticators.OAuth2.serverTokenEndpoint, {
            type:        'POST',
            data:        'grant_type=refresh_token&refresh_token=' + this.get(refreshToken),
            contentType: 'application/x-www-form-urlencoded'
          }).then(function(response) {
            _this._handleAuthTokenRefresh(response.expiry, response.refresh_token);
            _this.trigger('updated_session_data', { authToken: response.access_token });
          });
        }, waitTime);
      }
    }
  }
});

Ember.SimpleAuth.Authenticators.OAuth2.serverTokenEndpoint = '/token';
Ember.SimpleAuth.Authenticators.OAuth2.autoRefreshToken    = true;
