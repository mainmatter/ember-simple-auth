'use strict';

Ember.SimpleAuth.Authenticators.OAuth2 = Ember.Object.extend(Ember.Evented, {
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
      var data = _this.buildRequestData('password', { username: credentials.identification, password: credentials.password });
      Ember.$.ajax({
        url:         Ember.SimpleAuth.Authenticators.OAuth2.serverTokenEndpoint,
        type:        'POST',
        data:        data,
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

  invaldiate: function() {
    Ember.run.cancel(Ember.SimpleAuth.Authenticators.OAuth2._refreshTokenTimeout);
    delete Ember.SimpleAuth.Authenticators.OAuth2._refreshTokenTimeout;
    return new Ember.RSVP.Promise(function(resolve) { resolve(); });
  },

  /**
    @method buildRequestData
    @private
  */
  buildRequestData: function(grantType, data) {
    var requestData = Ember.$.extend({ grant_type: grantType }, data);
    if (!Ember.isEmpty(Ember.SimpleAuth.Authenticators.OAuth2.cliendId)) {
      requestData.client_id = Ember.SimpleAuth.Authenticators.OAuth2.cliendId;
      if (!Ember.isEmpty(Ember.SimpleAuth.Authenticators.OAuth2.cliendSecret)) {
        requestData.client_secret = Ember.SimpleAuth.Authenticators.OAuth2.cliendSecret;
      }
    }
    return requestData;
  },

  /**
    @method handleAuthTokenRefresh
    @private
  */
  handleAuthTokenRefresh: function(authTokenExpiry, refreshToken) {
    var _this = this;
    if (Ember.SimpleAuth.Authenticators.OAuth2.refreshAuthTokens) {
      Ember.run.cancel(Ember.SimpleAuth.Authenticators.OAuth2._refreshTokenTimeout);
      delete Ember.SimpleAuth.Authenticators.OAuth2._refreshTokenTimeout;
      var waitTime = (authTokenExpiry || 0) * 1000 - 5000; //refresh token 5 seconds before it expires
      if (!Ember.isEmpty(refreshToken) && waitTime > 0) {
        Ember.SimpleAuth.Authenticators.OAuth2._refreshTokenTimeout = Ember.run.later(this, function() {
          var data  = this.buildRequestData('refresh_token', { refresh_token: refreshToken });
          Ember.$.ajax({
            url:         Ember.SimpleAuth.Authenticators.OAuth2.serverTokenEndpoint,
            type:        'POST',
            data:        data,
            contentType: 'application/x-www-form-urlencoded'
          }).then(function(response) {
            Ember.run(function() {
              authTokenExpiry = response.expires_in || authTokenExpiry;
              refreshToken    = response.refresh_token || refreshToken;
              _this.handleAuthTokenRefresh(authTokenExpiry, refreshToken);
              _this.trigger('updated_session_data', { authToken: response.access_token, authTokenExpiry: authTokenExpiry, refreshToken: refreshToken });
            });
          });
        }, waitTime);
      }
    }
  }
});

Ember.SimpleAuth.Authenticators.OAuth2.serverTokenEndpoint = '/token';
Ember.SimpleAuth.Authenticators.OAuth2.refreshAuthTokens   = true;
Ember.SimpleAuth.Authenticators.OAuth2.cliendId            = null;
Ember.SimpleAuth.Authenticators.OAuth2.cliendSecret        = null;
