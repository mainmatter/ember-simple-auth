var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import { Base } from './base';
import { isSecureUrl } from '../utils/is_secure_url';

/**
  Authenticator that conforms to OAuth 2
  ([RFC 6749](http://tools.ietf.org/html/rfc6749)), specifically the _"Resource
  Owner Password Credentials Grant Type"_.

  This authenticator supports refreshing the access token automatically and
  will trigger the `'ember-simple-auth:session-updated'` event each time the
  token was refreshed.

  @class OAuth2
  @namespace Authenticators
  @extends Authenticators.Base
*/
var OAuth2 = Base.extend({
  /**
    The endpoint on the server the authenticator acquires the access token
    from.

    @property serverTokenEndpoint
    @type String
    @default '/token'
  */
  serverTokenEndpoint: '/token',
  /**
    Sets whether the authenticator automatically refreshes access tokens.

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
    Restores the session from a set of session properties; __will return a
    resolving promise when there's a non-empty `access_token` in the `data`__
    and a rejecting promise otherwise.

    This method also schedules automatic token refreshing when there are values
    for `refresh_token` and `expires_in` in the `data` and automatic token
    refreshing is not disabled (see
    [EmberSimpleAuth.Authenticators.OAuth2#refreshAccessTokens](#EmberSimpleAuth-Authenticators-OAuth2-refreshAccessTokens)).

    @method restore
    @param {Object} data The data to restore the session from
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
  */
  restore: function(data) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(data.access_token)) {
        _this.scheduleAccessTokenRefresh(data.expires_in, data.expires_at, data.refresh_token);
        resolve(data);
      } else {
        reject();
      }
    });
  },

  /**
    Authenticates the session with the specified `credentials`; the credentials
    are `POST`ed to the `serverTokenEndpoint` and if they are valid the server
    returns an access token in response (see
    http://tools.ietf.org/html/rfc6749#section-4.3). __If the credentials are
    valid and authentication succeeds, a promise that resolves with the
    server's response is returned__, otherwise a promise that rejects with the
    error is returned.

    This method also schedules automatic token refreshing when there are values
    for `refresh_token` and `expires_in` in the server response and automatic
    token refreshing is not disabled (see
    [EmberSimpleAuth.Authenticators.OAuth2#refreshAccessTokens](#EmberSimpleAuth-Authenticators-OAuth2-refreshAccessTokens)).

    @method authenticate
    @param {Object} credentials The credentials to authenticate the session with
    @return {Ember.RSVP.Promise} A promise that resolves when an access token is successfully acquired from the server and rejects otherwise
  */
  authenticate: function(credentials) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var data = { grant_type: 'password', username: credentials.identification, password: credentials.password };
      _this.makeRequest(data).then(function(response) {
        Ember.run(function() {
          var expiresAt = _this.absolutizeExpirationTime(response.expires_in);
          _this.scheduleAccessTokenRefresh(response.expires_in, expiresAt, response.refresh_token);
          resolve(Ember.$.extend(response, { expires_at: expiresAt }));
        });
      }, function(xhr, status, error) {
        Ember.run(function() {
          reject(xhr.responseJSON || xhr.responseText);
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
    return new Ember.RSVP.resolve();
  },

  /**
    Sends an `AJAX` request to the `serverTokenEndpoint`. This will always be a
    _"POST_" request with content type _"application/x-www-form-urlencoded"_ as
    specified in [RFC 6749](http://tools.ietf.org/html/rfc6749).

    This method is not meant to be used directly but serves as an extension
    point to e.g. add _"Client Credentials"_ (see
    [RFC 6749, section 2.3](http://tools.ietf.org/html/rfc6749#section-2.3)).

    @method makeRequest
    @param {Object} data The data to send with the request, e.g. username and password or the refresh token
    @return {Deferred object} A Deferred object (see [the jQuery docs](http://api.jquery.com/category/deferred-object/)) that is compatible to Ember.RSVP.Promise; will resolve if the request succeeds, reject otherwise
    @protected
  */
  makeRequest: function(data) {
    if (!isSecureUrl(this.serverTokenEndpoint)) {
      Ember.Logger.warn('Credentials are transmitted via an insecure connection - use HTTPS to keep them secure.');
    }
    return Ember.$.ajax({
      url:         this.serverTokenEndpoint,
      type:        'POST',
      data:        data,
      dataType:    'json',
      contentType: 'application/x-www-form-urlencoded'
    });
  },

  /**
    @method scheduleAccessTokenRefresh
    @private
  */
  scheduleAccessTokenRefresh: function(expiresIn, expiresAt, refreshToken) {
    var _this = this;
    if (this.refreshAccessTokens) {
      Ember.run.cancel(this._refreshTokenTimeout);
      delete this._refreshTokenTimeout;
      var now = new Date();
      if (Ember.isEmpty(expiresAt) && !Ember.isEmpty(expiresIn)) {
        expiresAt = new Date(now.getTime() + (expiresIn - 5) * 1000).getTime();
      }
      if (!Ember.isEmpty(refreshToken) && !Ember.isEmpty(expiresAt) && expiresAt > now) {
        var waitTime = expiresAt - now.getTime();
        this._refreshTokenTimeout = Ember.run.later(this, this.refreshAccessToken, expiresIn, refreshToken, waitTime);
      }
    }
  },

  /**
    @method refreshAccessToken
    @private
  */
  refreshAccessToken: function(expiresIn, refreshToken) {
    var _this = this;
    var data  = { grant_type: 'refresh_token', refresh_token: refreshToken };
    this.makeRequest(data).then(function(response) {
      Ember.run(function() {
        expiresIn     = response.expires_in || expiresIn;
        refreshToken  = response.refresh_token || refreshToken;
        var expiresAt = _this.absolutizeExpirationTime(expiresIn);
        _this.scheduleAccessTokenRefresh(expiresIn, null, refreshToken);
        _this.trigger('ember-simple-auth:session-updated', Ember.$.extend(response, { expires_in: expiresIn, expires_at: expiresAt, refresh_token: refreshToken }));
      });
    }, function(xhr, status, error) {
      Ember.Logger.warn('Access token could not be refreshed - server responded with ' + error + '.');
    });
  },

  /**
    @method absolutizeExpirationTime
    @private
  */
  absolutizeExpirationTime: function(expiresIn) {
    if (!Ember.isEmpty(expiresIn)) {
      return new Date((new Date().getTime()) + (expiresIn - 5) * 1000).getTime();
    }
  }
});

export { OAuth2 };
