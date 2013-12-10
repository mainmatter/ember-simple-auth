'use strict';

Ember.SimpleAuth.Authenticators.OAuth2 = Ember.Object.extend(Ember.Evented, {
  serverTokenEndpoint: '/token',
  autoRefreshToken:    true,

  restore: function(properties) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(properties.authToken)) {
        _this.handleAuthTokenRefresh(properties.authTokenExpiry, properties.refreshToken);
        resolve(properties);
      } else {
        reject();
      }
    });
  },

  authenticate: function(credentials) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var postData = ['grant_type=password', 'username=' + credentials.identification, 'password=' + credentials.password].join('&');
      Ember.$.ajax({
        url:         _this.get('serverTokenEndpoint'),
        type:        'POST',
        data:        postData,
        contentType: 'application/x-www-form-urlencoded'
      }).then(function(response) {
        Ember.run(function() {
          _this.handleAuthTokenRefresh(response.expires_in, response.refresh_token);
          resolve({ authToken: response.access_token, authTokenExpiry: response.expires_in, refreshToken: response.refresh_token });
        });
      }, function(xhr, status, error) {
        Ember.run(function() {
          reject(xhr.responseText);
        });
      });
    });
  },

  unauthenticate: function() {
    Ember.run.cancel(Ember.SimpleAuth.Authenticators.OAuth2._refreshTokenTimeout);
    delete Ember.SimpleAuth.Authenticators.OAuth2._refreshTokenTimeout;
    return Ember.RSVP.resolve();
  },

  /**
    @method handleAuthTokenRefresh
    @private
  */
  handleAuthTokenRefresh: function(authTokenExpiry, refreshToken) {
    if (this.get('autoRefreshToken')) {
      Ember.run.cancel(Ember.SimpleAuth.Authenticators.OAuth2._refreshTokenTimeout);
      delete Ember.SimpleAuth.Authenticators.OAuth2._refreshTokenTimeout;
      var waitTime = (authTokenExpiry || 0) * 1000 - 5000;
      if (!Ember.isEmpty(refreshToken) && waitTime > 0) {
        Ember.SimpleAuth.Authenticators.OAuth2._refreshTokenTimeout = Ember.run.later(this, function() {
          var _this = this;
          Ember.$.ajax({
            url:         this.get('serverTokenEndpoint'),
            type:        'POST',
            data:        'grant_type=refresh_token&refresh_token=' + refreshToken,
            contentType: 'application/x-www-form-urlencoded'
          }).then(function(response) {
            Ember.run(function() {
              _this.handleAuthTokenRefresh(response.expires_in || authTokenExpiry, response.refresh_token || refreshToken);
              _this.trigger('updated_session_data', { authToken: response.access_token });
            });
          });
        }, waitTime);
      }
    }
  }
});
