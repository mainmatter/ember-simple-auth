/* jscs:disable requireDotNotation */
import Ember from 'ember';
import Base from './base';
import Configuration from './../configuration';

/**
  Authenticator that conforms to OAuth 2
  ([RFC 6749](http://tools.ietf.org/html/rfc6749)), specifically the _"Resource
  Owner Password Credentials Grant Type"_.

  This authenticator supports access token refresh (see
  [RFC 6749, section 6](http://tools.ietf.org/html/rfc6749#section-6)).

  _The factory for this authenticator is registered as
  `'simple-auth-authenticator:oauth2-password-grant'` in Ember's
  container._

  @class OAuth2
  @namespace Authenticators
  @module authenticators/oauth2
  @extends Base
  @public
*/
export default Base.extend({
  /**
    Triggered when the authenticator refreshes the access token (see
    [RFC 6749, section 6](http://tools.ietf.org/html/rfc6749#section-6)).

    @event sessionDataUpdated
    @param {Object} data The updated session data
    @public
  */

  /**
    The client_id to be sent to the authorization server

    This value can be configured via
    [`SimpleAuth.Configuration.OAuth2#clientId`](#SimpleAuth-Configuration-OAuth2-clientId).

    @property clientId
    @type String
    @default null
    @public
  */
  clientId: null,

  /**
    The endpoint on the server the authenticator acquires the access token
    from.

    This value can be configured via
    [`SimpleAuth.Configuration.OAuth2#serverTokenEndpoint`](#SimpleAuth-Configuration-OAuth2-serverTokenEndpoint).

    @property serverTokenEndpoint
    @type String
    @default '/token'
    @public
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
    @public
  */
  serverTokenRevocationEndpoint: null,

  /**
    Sets whether the authenticator automatically refreshes access tokens.

    This value can be configured via
    [`SimpleAuth.Configuration.OAuth2#refreshAccessTokens`](#SimpleAuth-Configuration-OAuth2-refreshAccessTokens).

    @property refreshAccessTokens
    @type Boolean
    @default true
    @public
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
  init() {
    this.clientId                      = Configuration.oauth2.clientId;
    this.serverTokenEndpoint           = Configuration.oauth2.serverTokenEndpoint;
    this.serverTokenRevocationEndpoint = Configuration.oauth2.serverTokenRevocationEndpoint;
    this.refreshAccessTokens           = Configuration.oauth2.refreshAccessTokens;
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
    @param {Object} data The data to restore the session from
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
    @public
  */
  restore(data) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      let now = (new Date()).getTime();
      if (!Ember.isEmpty(data['expires_at']) && data['expires_at'] < now) {
        if (this.refreshAccessTokens) {
          this.refreshAccessToken(data['expires_in'], data['refresh_token']).then(resolve, reject);
        } else {
          reject();
        }
      } else {
        if (Ember.isEmpty(data['access_token'])) {
          reject();
        } else {
          this.scheduleAccessTokenRefresh(data['expires_in'], data['expires_at'], data['refresh_token']);
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
    @public
  */
  authenticate(options) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      let data = { 'grant_type': 'password', username: options.identification, password: options.password };
      if (!Ember.isEmpty(options.scope)) {
        let scopesString = Ember.makeArray(options.scope).join(' ');
        Ember.merge(data, { scope: scopesString });
      }
      this.makeRequest(this.serverTokenEndpoint, data).then((response) => {
        Ember.run(() => {
          let expiresAt = this.absolutizeExpirationTime(response['expires_in']);
          this.scheduleAccessTokenRefresh(response['expires_in'], expiresAt, response['refresh_token']);
          if (!Ember.isEmpty(expiresAt)) {
            response = Ember.merge(response, { 'expires_at': expiresAt });
          }
          resolve(response);
        });
      }, (xhr) => {
        Ember.run(() => {
          reject(xhr.responseJSON || xhr.responseText);
        });
      });
    });
  },

  /**
    Cancels any outstanding automatic token refreshes and returns a resolving
    promise.

    @method invalidate
    @param {Object} data The data of the session to be invalidated
    @return {Ember.RSVP.Promise} A resolving promise
    @public
  */
  invalidate(data) {
    function success(resolve) {
      Ember.run.cancel(this._refreshTokenTimeout);
      delete this._refreshTokenTimeout;
      resolve();
    }
    return new Ember.RSVP.Promise((resolve) => {
      if (Ember.isEmpty(this.serverTokenRevocationEndpoint)) {
        success.apply(this, [resolve]);
      } else {
        let requests = [];
        Ember.A(['access_token', 'refresh_token']).forEach((tokenType) => {
          let token = data[tokenType];
          if (!Ember.isEmpty(token)) {
            requests.push(this.makeRequest(this.serverTokenRevocationEndpoint, {
              'token_type_hint': tokenType, token
            }));
          }
        });
        Ember.$.when.apply(Ember.$, requests).always(() => {
          success.apply(this, [resolve]);
        });
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
    @public
  */
  makeRequest(url, data) {
    let options = {
      url,
      type:         'POST',
      data,
      dataType:     'json',
      contentType:  'application/x-www-form-urlencoded'
    };

    if (!Ember.isEmpty(this.clientId)) {
      let base64ClientId = window.btoa(this.clientId.concat(':'));
      Ember.merge(options, {
        headers: {
          Authorization: `Basic ${base64ClientId}`
        }
      });
    }

    return Ember.$.ajax(options);
  },

  /**
    @method scheduleAccessTokenRefresh
    @private
  */
  scheduleAccessTokenRefresh(expiresIn, expiresAt, refreshToken) {
    if (this.refreshAccessTokens) {
      let now = (new Date()).getTime();
      if (Ember.isEmpty(expiresAt) && !Ember.isEmpty(expiresIn)) {
        expiresAt = new Date(now + expiresIn * 1000).getTime();
      }
      let offset = (Math.floor(Math.random() * 5) + 5) * 1000;
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
  refreshAccessToken(expiresIn, refreshToken) {
    let data  = { 'grant_type': 'refresh_token', 'refresh_token': refreshToken };
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.makeRequest(this.serverTokenEndpoint, data).then((response) => {
        Ember.run(() => {
          expiresIn     = response['expires_in'] || expiresIn;
          refreshToken  = response['refresh_token'] || refreshToken;
          let expiresAt = this.absolutizeExpirationTime(expiresIn);
          let data      = Ember.merge(response, { 'expires_in': expiresIn, 'expires_at': expiresAt, 'refresh_token': refreshToken });
          this.scheduleAccessTokenRefresh(expiresIn, null, refreshToken);
          this.trigger('sessionDataUpdated', data);
          resolve(data);
        });
      }, (xhr, status, error) => {
        Ember.Logger.warn(`Access token could not be refreshed - server responded with ${error}.`);
        reject();
      });
    });
  },

  /**
    @method absolutizeExpirationTime
    @private
  */
  absolutizeExpirationTime(expiresIn) {
    if (!Ember.isEmpty(expiresIn)) {
      return new Date((new Date().getTime()) + expiresIn * 1000).getTime();
    }
  }
});
