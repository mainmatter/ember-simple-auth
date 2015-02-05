import Base from 'simple-auth/authenticators/base';
import Configuration from './../configuration';

/**
  Authenticator that conforms to OAuth 2
  ([RFC 6749](http://tools.ietf.org/html/rfc6749)), specifically the _"Resource
  Owner Password Credentials Grant Type"_.

  This authenticator supports access token refresh (see
  [RFC 6740, section 6](http://tools.ietf.org/html/rfc6749#section-6)).

  _The factory for this authenticator is registered as
  `'simple-auth-authenticator:oauth2-password-grant'` in Ember's
  container._

  @class OAuth2
  @namespace SimpleAuth.Authenticators
  @module simple-auth-oauth2/authenticators/oauth2
  @extends Base
*/
export default Base.extend({
  /**
    Triggered when the authenticator refreshes the access token (see
    [RFC 6740, section 6](http://tools.ietf.org/html/rfc6749#section-6)).

    @event sessionDataUpdated
    @param {Object} data The updated session data
  */

  /**
    The endpoint on the server the authenticator acquires the access token
    from.

    This value can be configured via
    [`SimpleAuth.Configuration.OAuth2#serverTokenEndpoint`](#SimpleAuth-Configuration-OAuth2-serverTokenEndpoint).

    @property serverTokenEndpoint
    @type String
    @default '/token'
  */
  serverTokenEndpoint: '/token',

  /**
    The endpoint on the server the authenticator uses to revoke tokens. Only
    set this if the server actually supports token revokation.

    This value can be configured via
    [`SimpleAuth.Configuration.OAuth2#serverTokenRevocationEndpoint`](#SimpleAuth-Configuration-OAuth2-serverTokenRevocationEndpoint).

    @property serverTokenRevocationEndpoint
    @type String
    @default null
  */
  serverTokenRevocationEndpoint: null,

  /**
    Sets whether the authenticator automatically refreshes access tokens.

    This value can be configured via
    [`SimpleAuth.Configuration.OAuth2#refreshAccessTokens`](#SimpleAuth-Configuration-OAuth2-refreshAccessTokens).

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
    @method init
    @private
  */
  init: function() {
    this.serverTokenEndpoint           = Configuration.serverTokenEndpoint;
    this.serverTokenRevocationEndpoint = Configuration.serverTokenRevocationEndpoint;
    this.refreshAccessTokens           = Configuration.refreshAccessTokens;
  },

  /**
    Restores the session from a set of session properties; __will return a
    resolving promise when there's a non-empty `access_token` in the `data`__
    and a rejecting promise otherwise.

    This method also schedules automatic token refreshing when there are values
    for `refresh_token` and `expires_in` in the `data` and automatic token
    refreshing is not disabled (see
    [`Authenticators.OAuth2#refreshAccessTokens`](#SimpleAuth-Authenticators-OAuth2-refreshAccessTokens)).

    @method restore
    @param {Object} data The current sesion data
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
  */
  restore: function(data) {
    var _this = this;
    function fail(reject, data) {
      reject(_this.stripAuthenticatedData(data));
    }
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var now = (new Date()).getTime();
      if (!Ember.isEmpty(data.expires_at) && data.expires_at < now) {
        if (_this.refreshAccessTokens) {
          _this.refreshAccessToken(data.expires_in, data.refresh_token).then(function(data) {
            resolve(data);
          }, function() {
            fail(reject, data);
          });
        } else {
          fail(reject, data);
        }
      } else {
        if (Ember.isEmpty(data.access_token)) {
          fail(reject, data);
        } else {
          _this.scheduleAccessTokenRefresh(data.expires_in, data.expires_at, data.refresh_token);
          resolve(data);
        }
      }
    });
  },

  /**
    Authenticates the session with the specified `options`; makes a `POST`
    request to the
    [`Authenticators.OAuth2#serverTokenEndpoint`](#SimpleAuth-Authenticators-OAuth2-serverTokenEndpoint)
    with the passed credentials and optional scope and receives the token in
    response (see http://tools.ietf.org/html/rfc6749#section-4.3).

    __If the credentials are valid (and the optionally requested scope is
    granted) and thus authentication succeeds, a promise that resolves with the
    server's response is returned__, otherwise a promise that rejects with the
    error is returned.

    This method also schedules automatic token refreshing when there are values
    for `refresh_token` and `expires_in` in the server response and automatic
    token refreshing is not disabled (see
    [`Authenticators.OAuth2#refreshAccessTokens`](#SimpleAuth-Authenticators-OAuth2-refreshAccessTokens)).

    @method authenticate
    @param {Object} options
    @param {String} options.identification The resource owner username
    @param {String} options.password The resource owner password
    @param {String|Array} [options.scope] The scope of the access request (see [RFC 6749, section 3.3](http://tools.ietf.org/html/rfc6749#section-3.3))
    @return {Ember.RSVP.Promise} A promise that resolves when an access token is successfully acquired from the server and rejects otherwise
  */
  authenticate: function(options) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var data = { grant_type: 'password', username: options.identification, password: options.password };
      if (!Ember.isEmpty(options.scope)) {
        var scopesString = Ember.makeArray(options.scope).join(' ');
        Ember.merge(data, { scope: scopesString });
      }
      _this.makeRequest(_this.serverTokenEndpoint, data).then(function(response) {
        Ember.run(function() {
          var expiresAt = _this.absolutizeExpirationTime(response.expires_in);
          _this.scheduleAccessTokenRefresh(response.expires_in, expiresAt, response.refresh_token);
          if (!Ember.isEmpty(expiresAt)) {
            response = Ember.merge(response, { expires_at: expiresAt });
          }
          resolve(response);
        });
      }, function(xhr, status, error) {
        Ember.run(function() {
          reject(xhr.responseJSON || xhr.responseText);
        });
      });
    });
  },

  /**
    Cancels any outstanding automatic token refreshes, deletes the
    `access_token`, `refresh_token`, `expires_in` and `expires_at` properties
    from the session and returns a resolving promise.

    @method invalidate
    @param {Object} data The data of the session to be invalidated
    @return {Ember.RSVP.Promise} A resolving promise
  */
  invalidate: function(data) {
    var _this = this;
    function success(resolve) {
      Ember.run.cancel(_this._refreshTokenTimeout);
      delete _this._refreshTokenTimeout;
      resolve(_this.stripAuthenticatedData(data));
    }
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(_this.serverTokenRevocationEndpoint)) {
        var requests = [];
        Ember.A(['access_token', 'refresh_token']).forEach(function(tokenType) {
          if (!Ember.isEmpty(data[tokenType])) {
            requests.push(_this.makeRequest(_this.serverTokenRevocationEndpoint, {
              token_type_hint: tokenType, token: data[tokenType]
            }));
          }
        });
        Ember.$.when.apply(Ember.$, requests).always(function(responses) {
          success(resolve);
        });
      } else {
        success(resolve);
      }
    });
  },

  /**
    Sends an `AJAX` request to the `url`. This will always be a _"POST"_
    request with content type _"application/x-www-form-urlencoded"_ as
    specified in [RFC 6749](http://tools.ietf.org/html/rfc6749).

    This method is not meant to be used directly but serves as an extension
    point to e.g. add _"Client Credentials"_ (see
    [RFC 6749, section 2.3](http://tools.ietf.org/html/rfc6749#section-2.3)).

    @method makeRequest
    @param {Object} url The url to send the request to
    @param {Object} data The data to send with the request, e.g. username and password or the refresh token
    @return {Deferred object} A Deferred object (see [the jQuery docs](http://api.jquery.com/category/deferred-object/)) that is compatible to Ember.RSVP.Promise; will resolve if the request succeeds, reject otherwise
    @protected
  */
  makeRequest: function(url, data) {
    return Ember.$.ajax({
      url:         url,
      type:        'POST',
      data:        data,
      dataType:    'json',
      contentType: 'application/x-www-form-urlencoded'
    });
  },

  /**
    @method stripAuthenticatedData
    @private
  */
  stripAuthenticatedData: function(data) {
    delete data.access_token;
    delete data.refresh_token;
    delete data.expires_in;
    delete data.expires_at;
    return data;
  },

  /**
    @method scheduleAccessTokenRefresh
    @private
  */
  scheduleAccessTokenRefresh: function(expiresIn, expiresAt, refreshToken) {
    var _this = this;
    if (this.refreshAccessTokens) {
      var now = (new Date()).getTime();
      if (Ember.isEmpty(expiresAt) && !Ember.isEmpty(expiresIn)) {
        expiresAt = new Date(now + expiresIn * 1000).getTime();
      }
      var offset = (Math.floor(Math.random() * 5) + 5) * 1000;
      if (!Ember.isEmpty(refreshToken) && !Ember.isEmpty(expiresAt) && expiresAt > now - offset) {
        Ember.run.cancel(this._refreshTokenTimeout);
        delete this._refreshTokenTimeout;
        if (!Ember.testing) {
          this._refreshTokenTimeout = Ember.run.later(this, this.refreshAccessToken, expiresIn, refreshToken, expiresAt - now - offset);
        }
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
    return new Ember.RSVP.Promise(function(resolve, reject) {
      _this.makeRequest(_this.serverTokenEndpoint, data).then(function(response) {
        Ember.run(function() {
          expiresIn     = response.expires_in || expiresIn;
          refreshToken  = response.refresh_token || refreshToken;
          var expiresAt = _this.absolutizeExpirationTime(expiresIn);
          var data      = Ember.merge(response, { expires_in: expiresIn, expires_at: expiresAt, refresh_token: refreshToken });
          _this.scheduleAccessTokenRefresh(expiresIn, null, refreshToken);
          _this.trigger('sessionDataUpdated', data);
          resolve(data);
        });
      }, function(xhr, status, error) {
        Ember.Logger.warn('Access token could not be refreshed - server responded with ' + error + '.');
        reject();
      });
    });
  },

  /**
    @method absolutizeExpirationTime
    @private
  */
  absolutizeExpirationTime: function(expiresIn) {
    if (!Ember.isEmpty(expiresIn)) {
      return new Date((new Date().getTime()) + expiresIn * 1000).getTime();
    }
  }
});
