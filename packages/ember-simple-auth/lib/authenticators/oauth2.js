'use strict';

Ember.SimpleAuth.Authenticators.OAuth2 = Ember.SimpleAuth.Authenticators.Base.extend({
  serverTokenEndpoint:  '/token',
  refreshAuthTokens:    true,
  _refreshTokenTimeout: null,

  restore: function(properties) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      _this._super(properties).then(function(properties) {
        _this.scheduleAuthTokenRefresh(properties.authTokenExpiry, properties.refreshToken);
        resolve(properties);
      }, function() {
        reject();
      });
    });
  },

  authenticate: function(credentials) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var data = { grant_type: 'password', username: credentials.identification, password: credentials.password };
      _this.makeRequest(data).then(function(response) {
        Ember.run(function() {
          _this.scheduleAuthTokenRefresh(response.expires_in, response.refresh_token);
          resolve({ authToken: response.access_token, authTokenExpiry: response.expires_in, refreshToken: response.refresh_token });
        });
      }, function(xhr, status, error) {
        Ember.run(function() {
          reject(xhr.responseText);
        });
      });
    });
  },

  invalidate: function() {
    Ember.run.cancel(this._refreshTokenTimeout);
    delete this._refreshTokenTimeout;
    return new Ember.RSVP.Promise(function(resolve) { resolve(); });
  },

  /**
    @method scheduleAuthTokenRefresh
    @private
  */
  scheduleAuthTokenRefresh: function(authTokenExpiry, refreshToken) {
    var _this = this;
    if (this.refreshAuthTokens) {
      Ember.run.cancel(this._refreshTokenTimeout);
      delete this._refreshTokenTimeout;
      var waitTime = (authTokenExpiry || 0) * 1000 - 5000; //refresh token 5 seconds before it expires
      if (!Ember.isEmpty(refreshToken) && waitTime > 0) {
        this._refreshTokenTimeout = Ember.run.later(this, this.refreshAuthToken, authTokenExpiry, refreshToken, waitTime);
      }
    }
  },

  /**
    @method refreshAuthToken
    @private
  */
  refreshAuthToken: function(authTokenExpiry, refreshToken) {
    var _this = this;
    var data  = { grant_type: 'refresh_token', refresh_token: refreshToken };
    this.makeRequest(data).then(function(response) {
      Ember.run(function() {
        authTokenExpiry = response.expires_in || authTokenExpiry;
        refreshToken    = response.refresh_token || refreshToken;
        _this.scheduleAuthTokenRefresh(authTokenExpiry, refreshToken);
        _this.trigger('ember-simple-auth:session-updated', { authToken: response.access_token, authTokenExpiry: authTokenExpiry, refreshToken: refreshToken });
      });
    }, function(xhr, status, error) {
      Ember.Logger.warn('Access token could not be refreshed - server responded with ' + error + '.');
    });
  },

  makeRequest: function(data) {
    return Ember.$.ajax({
      url:         this.serverTokenEndpoint,
      type:        'POST',
      data:        data,
      contentType: 'application/x-www-form-urlencoded'
    });
  }
});
