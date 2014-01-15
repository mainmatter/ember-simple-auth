'use strict';

/**
  Authenticator that conforms to OAuth 2 (RFC 6749), specifically the
  _"Resource Owner Password Credentials Grant Type"_.

  This authenticator supports refreshing the access token automatically and
  will trigger the 'ember-simple-auth:session-updated' event each time the
  token was refreshed.

  @class OAuth2
  @namespace Ember.SimpleAuth.Authenticators
  @extends Ember.SimpleAuth.Authenticators.Base
*/
Ember.SimpleAuth.Authenticators.OAuth2 = Ember.SimpleAuth.Authenticators.Base.extend({
  /**
    The endpoint on the server the authenticator acquires the access token
    from.

    @property serverTokenEndpoint
    @type String
    @default '/token'
  */
  serverTokenEndpoint: '/token',
  /**
   * The hostname on the server
   * 
   * @property serverHostname
   * @type String
   */
  serverTokenHostname: null,
  /**
    Sets whether the authenticator should automatically refresh access tokens
    before they expire.

    @property refreshAccessTokens
    @type Boolean
    @default true
  */
  refreshAccessTokens: true,
  /**
    @property _refreshTokenTimeout
    @private
  */
  _refreshTokenTimeout: null,

  /**
    Restores the session from a set of session properties; will return a
    resolving promise when there's a non-empty `access_token` in the
    `properties` and a rejecting promise otherwise.

    This method also schedule automatic token refreshing when there are a
    refresh token and a token expiration time in the `properties` and automatic
    token refreshing isn't disabled (see `refreshAccessTokens`).

    @method restore
    @param {Object} properties The properties to restore the session from
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
  */
  restore: function(properties) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(properties.access_token)) {
        _this.scheduleAccessTokenRefresh(properties.expires_in, properties.refresh_token);
        resolve(properties);
      } else {
        reject();
      }
    });
  },

  /**
    Authenticates the session with the specified `credentials`; the credentials
    are `POST`ed to the `serverTokenEndpoint` and in response the server
    returns an access token if the credentials are valid (see
    http://tools.ietf.org/html/rfc6749#section-4.3). If the credentials are
    valid and authentication succeeds, a promise that resolves with the
    server's response is returned, otherwise a promise that rejects with the
    error is returned.

    This method will also schedule automatic token refreshing when there are a
    refresh token and a token expiration time in the server's response and
    automatic token refreshing isn't diabled (see `refreshAccessTokens`).

    @method authenticate
    @param {Object} options The credentials to authenticate the session with
    @return {Ember.RSVP.Promise} A promise that resolves when an access token is successfully acquired from the server and rejects otherwise
  */
  authenticate: function(credentials) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var data = { grant_type: 'password', username: credentials.identification, password: credentials.password };
      _this.makeRequest(data).then(function(response) {
        Ember.run(function() {
          _this.scheduleAccessTokenRefresh(response.expires_in, response.refresh_token);
          resolve(response);
        });
      }, function(xhr, status, error) {
        Ember.run(function() {
          reject(xhr.responseText);
        });
      });
    });
  },

  /**
    Cancels any outstanding automatic token refreshes.

    @method invalidate
    @return {Ember.RSVP.Promise} A resolving promise
  */
  invalidate: function() {
    Ember.run.cancel(this._refreshTokenTimeout);
    delete this._refreshTokenTimeout;
    return new Ember.RSVP.Promise(function(resolve) { resolve(); });
  },

  /**
    @method scheduleAccessTokenRefresh
    @private
  */
  scheduleAccessTokenRefresh: function(expiry, refreshToken) {
    var _this = this;
    if (this.refreshAccessTokens) {
      Ember.run.cancel(this._refreshTokenTimeout);
      delete this._refreshTokenTimeout;
      var waitTime = (expiry || 0) * 1000 - 5000; //refresh token 5 seconds before it expires
      if (!Ember.isEmpty(refreshToken) && waitTime > 0) {
        this._refreshTokenTimeout = Ember.run.later(this, this.refreshAccessToken, expiry, refreshToken, waitTime);
      }
    }
  },

  /**
    @method refreshAccessToken
    @private
  */
  refreshAccessToken: function(expiry, refreshToken) {
    var _this = this;
    var data  = { grant_type: 'refresh_token', refresh_token: refreshToken };
    this.makeRequest(data).then(function(response) {
      Ember.run(function() {
        expiry       = response.expires_in || expiry;
        refreshToken = response.refresh_token || refreshToken;
        _this.scheduleAccessTokenRefresh(expiry, refreshToken);
        _this.trigger('ember-simple-auth:session-updated', Ember.$.extend(response, { expires_in: expiry, refresh_token: refreshToken }));
      });
    }, function(xhr, status, error) {
      Ember.Logger.warn('Access token could not be refreshed - server responded with ' + error + '.');
    });
  },

  /**
    @method makeRequest
    @private
  */
  makeRequest: function(data) {
    var requestUrl = this.serverTokenEndpoint;
    if (this.serverTokenHostname) {
      requestUrl = this.serverTokenHostname + requestUrl;
    }
    
    return Ember.$.ajax({
      url:         requestUrl,
      type:        'POST',
      data:        data,
      dataType:    'json',
      contentType: 'application/x-www-form-urlencoded'
    });
  }
});
