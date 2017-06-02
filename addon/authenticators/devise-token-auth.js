import Ember from 'ember';
import BaseAuthenticator from './base';

const { RSVP: { Promise }, isEmpty, run, get, $ } = Ember;

/**
  Authenticator that works with the Ruby gem
  [devise_token_auth](https://github.com/lynndylanhurley/devise_token_auth).

  It handles refreshing the token after each call.

  @class DeviseTokenAuthAuthenticator
  @module ember-simple-auth/authenticators/devise-token-auth
  @extends BaseAuthenticator
  @public
*/
export default BaseAuthenticator.extend({
  /**
    The endpoint on the server that the authentication request is sent to.
    If the URL of your api server differs from the apps, then include this

    @property serverAuthEndpoint
    @type String
    @default '/users/sign_in'
    @public
  */
  serverAuthEndpoint: '/users/sign_in',

  /**
    The devise resource name. __This will be used in the request and also be
    expected in the server's response.__

    @property resourceName
    @type String
    @default 'user'
    @public
  */
  resourceName: 'user',

  /**
    The token attribute name. __This will be used in the request and also be
    expected in the server's response.__

    @property tokenAttributeName
    @type String
    @default 'token'
    @public
  */
  tokenHeaderAttributeName: 'access-token',

  /**
    The token attribute name. __This will be used in the request and also be
    expected in the server's response.__

    @property tokenAttributeName
    @type String
    @default 'token'
    @public
  */
  clientHeaderAttributeName: 'client',

  /**
    The token attribute name. __This will be used in the request and also be
    expected in the server's response.__

    @property tokenAttributeName
    @type String
    @default 'token'
    @public
  */
  expiryHeaderAttributeName: 'expiry',

  /**
    The token attribute name. __This will be used in the request and also be
    expected in the server's response.__

    @property tokenAttributeName
    @type String
    @default 'token'
    @public
  */
  uidHeaderAttributeName: 'uid',

  /**
    The token attribute name. __This will be used in the request and also be
    expected in the server's response.__

    @property tokenAttributeName
    @type String
    @default 'token'
    @public
  */
  tokenHeaderTypeAttributeName: 'token-type',

  /**
    The identification attribute name. __This will be used in the request and
    also be expected in the server's response.__

    @property identificationAttributeName
    @type String
    @default 'email'
    @public
  */
  identificationAttributeName: 'email',

  /**
    Restores the session from a session data object; __returns a resolving
    promise when there are non-empty
    {{#crossLink "DeviseTokenAuthAuthenticator/tokenHeaderAttributeName:property"}}access-token{{/crossLink}},
    {{#crossLink "DeviseTokenAuthAuthenticator/clientHeaderAttributeName:property"}}client{{/crossLink}},
    {{#crossLink "DeviseTokenAuthAuthenticator/expiryHeaderAttributeName:property"}}expiry{{/crossLink}},
    {{#crossLink "DeviseTokenAuthAuthenticator/uidHeaderAttributeName:property"}}uid{{/crossLink}},
    and
    {{#crossLink "DeviseTokenAuthAuthenticator/tokenHeaderTypeAttributeName:property"}}token-type{{/crossLink}}.
    values in `data`__ and a rejecting promise otherwise.

    @method restore
    @param {Object} data The data to restore the session from
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming or remaining authenticated
    @public
  */
  restore(data) {
    const { tokenHeaderAttributeName,
            clientHeaderAttributeName,
            expiryHeaderAttributeName,
            uidHeaderAttributeName,
            tokenHeaderTypeAttributeName } = this.getProperties('tokenHeaderAttributeName',
                                                                'clientHeaderAttributeName',
                                                                'expiryHeaderAttributeName',
                                                                'uidHeaderAttributeName',
                                                                'tokenHeaderTypeAttributeName');
    const tokenHeaderAttribute = get(data, tokenHeaderAttributeName);
    const clientHeaderAttribute = get(data, clientHeaderAttributeName);
    const expiryHeaderAttribute = get(data, expiryHeaderAttributeName);
    const uidHeaderAttribute = get(data, uidHeaderAttributeName);
    const tokenHeaderTypeAttribute = get(data, tokenHeaderTypeAttributeName);

    if (!isEmpty(tokenHeaderAttribute)
        && !isEmpty(clientHeaderAttribute)
        && !isEmpty(expiryHeaderAttribute)
        && !isEmpty(uidHeaderAttribute)
        && !isEmpty(tokenHeaderTypeAttribute)
        && parseInt(expiryHeaderAttribute) > Date.now()/1000) { // expiryHeaderAttribute is in seconds as opposed to Date.now() which is in milliseconds
      return Promise.resolve(data);
    } else {
      return Promise.reject();
    }
  },

  /**
    Authenticates the session with the specified `identification` and
    `password`; the credentials are `POST`ed to the
    {{#crossLink "DeviseTokenAuthAuthenticator/serverAuthEndpoint:property"}}server{{/crossLink}}.
    If the credentials are valid the server will responds with a user object and a series of
    headers that will be used in subsequent calls to authenticate with:
    {{#crossLink "DeviseTokenAuthAuthenticator/tokenHeaderAttributeName:property"}}access-token{{/crossLink}},
    {{#crossLink "DeviseTokenAuthAuthenticator/clientHeaderAttributeName:property"}}client{{/crossLink}},
    {{#crossLink "DeviseTokenAuthAuthenticator/expiryHeaderAttributeName:property"}}expiry{{/crossLink}},
    {{#crossLink "DeviseTokenAuthAuthenticator/uidHeaderAttributeName:property"}}uid{{/crossLink}},
    and
    {{#crossLink "DeviseTokenAuthAuthenticator/tokenHeaderTypeAttributeName:property"}}token-type{{/crossLink}}.
    __If the credentials are valid and authentication succeeds, a promise that
    resolves with the server's response is returned__, otherwise a promise that
    rejects with the server error is returned.

    @method authenticate
    @param {String} identification The user's identification
    @param {String} password The user's password
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming authenticated
    @public
  */
  authenticate(identification, password) {
    return new Promise((resolve, reject) => {
      const { resourceName, identificationAttributeName } = this.getProperties('resourceName', 'identificationAttributeName');
      const { tokenHeaderAttributeName,
              clientHeaderAttributeName,
              expiryHeaderAttributeName,
              uidHeaderAttributeName,
              tokenHeaderTypeAttributeName } = this.getProperties('tokenHeaderAttributeName',
                                                                  'clientHeaderAttributeName',
                                                                  'expiryHeaderAttributeName',
                                                                  'uidHeaderAttributeName',
                                                                  'tokenHeaderTypeAttributeName');
      const data         = {
        password: password,
      };
      data[identificationAttributeName] = identification;

      return this.makeRequest(data).then(
        function (response, textStatus, jqXHR) {
          response[tokenHeaderAttributeName]     = jqXHR.getResponseHeader(tokenHeaderAttributeName);
          response[clientHeaderAttributeName]    = jqXHR.getResponseHeader(clientHeaderAttributeName);
          response[expiryHeaderAttributeName]    = jqXHR.getResponseHeader(expiryHeaderAttributeName);
          response[uidHeaderAttributeName]       = jqXHR.getResponseHeader(uidHeaderAttributeName);
          response[tokenHeaderTypeAttributeName] = jqXHR.getResponseHeader(tokenHeaderTypeAttributeName);
          run(null, resolve, response);
        },
        (xhr) => run(null, reject, xhr.responseJSON || xhr.responseText)
      );
    });
  },

  /**
    Does nothing

    @method invalidate
    @return {Ember.RSVP.Promise} A resolving promise
    @public
  */
  invalidate() {
    return Promise.resolve();
  },

  /**
    Makes a request to the devise server.

    @method makeRequest
    @param {Object} data The request data
    @param {Object} options Ajax configuration object merged into argument of `$.ajax`
    @return {jQuery.Deferred} A promise like jQuery.Deferred as returned by `$.ajax`
    @protected
  */
  makeRequest(data, options) {
    const serverAuthEndpoint = this.get('serverAuthEndpoint');
    const requestOptions = $.extend({}, {
      url:      serverAuthEndpoint,
      type:     'POST',
      dataType: 'json',
      processData: false,
      data: JSON.stringify(data),
      beforeSend(xhr, settings) {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', settings.accepts.json);
      }
    }, options || {});

    return $.ajax(requestOptions);
  }
});
