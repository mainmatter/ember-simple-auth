'use strict';

Ember.SimpleAuth.Authenticators.OAuth2 = Ember.Object.extend(Ember.Evented, {
  serverTokenEndpoint:  '/token',
  refreshAuthTokens:    true,
  cliendId:             null,
  cliendSecret:         null,
  _refreshTokenTimeout: null,

  restore: function(properties) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(properties.authToken)) {
        _this.scheduleAuthTokenRefresh(properties.authTokenExpiry, properties.refreshToken);
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
        url:         _this.serverTokenEndpoint,
        type:        'POST',
        data:        data,
        contentType: 'application/x-www-form-urlencoded'
      }).then(function(response) {
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
    @method buildRequestData
    @private
  */
  buildRequestData: function(grantType, data) {
    var requestData = Ember.$.extend({ grant_type: grantType }, data);
    if (!Ember.isEmpty(this.cliendId)) {
      requestData.client_id = this.cliendId;
      if (!Ember.isEmpty(this.cliendSecret)) {
        requestData.client_secret = this.cliendSecret;
      }
    }
    return requestData;
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
    var data  = this.buildRequestData('refresh_token', { refresh_token: refreshToken });
    Ember.$.ajax({
      url:         this.serverTokenEndpoint,
      type:        'POST',
      data:        data,
      contentType: 'application/x-www-form-urlencoded'
    }).then(function(response) {
      Ember.run(function() {
        authTokenExpiry = response.expires_in || authTokenExpiry;
        refreshToken    = response.refresh_token || refreshToken;
        _this.scheduleAuthTokenRefresh(authTokenExpiry, refreshToken);
        _this.trigger('ember-simple-auth:session_updated', { authToken: response.access_token, authTokenExpiry: authTokenExpiry, refreshToken: refreshToken });
      });
    }, function(xhr, status, error) {
      Ember.Logger.warn('Access token could not be refreshed - server responded with ' + error + '.');
    });
  }
});
