import Ember from 'ember';
import DeviseAuthenticator from './devise';

const { RSVP: { Promise }, isEmpty, run } = Ember;

/**
  Authenticator that works with the Ruby gem
  [devise_token_auth](https://github.com/lynndylanhurley/devise_token_auth)
  which does token-based authentication. Read more about the [Token Header format](https://github.com/lynndylanhurley/devise_token_auth#token-header-format).

  @class DeviseTokenAuthAuthenticator
  @module ember-simple-auth/authenticators/devise-token-auth
  @extends DeviseAuthenticator
  @public
*/
export default DeviseAuthenticator.extend({
  /**
   The [devise_token_auth](https://github.com/lynndylanhurley/devise_token_auth)-mounted
   endpoint on the server that the authentication request is sent to.

   @property serverTokenEndpoint
   @type String
   @default 'auth/sign_in'
   @public
   */
  serverTokenEndpoint: 'auth/sign_in',

  /**
    The attribute in the session data that represents the authentication
    token. __This will be used in the request and also be expected in the
    server's response.__

    @property tokenAttributeName
    @type String
    @default 'accessToken'
    @public
  */
  tokenAttributeName: 'accessToken',

  /**
    Authenticates the session with the specified `identification` and
    `password`; the credentials are `POST`ed to the
    {{#crossLink "DeviseAuthenticator/serverTokenEndpoint:property"}}server{{/crossLink}}.
    If the credentials are valid the server will respond with a
    {{#crossLink "DeviseAuthenticator/tokenAttributeName:property"}}token{{/crossLink}}
    and
    {{#crossLink "DeviseAuthenticator/identificationAttributeName:property"}}identification{{/crossLink}}.
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
      const useResponse = this.get('rejectWithResponse');
      const { resourceName, identificationAttributeName, tokenAttributeName } = this.getProperties('resourceName', 'identificationAttributeName', 'tokenAttributeName');
      const data         = {};
      data[resourceName] = { password };
      data[resourceName][identificationAttributeName] = identification;

      this.makeRequest(data).then((response) => {
        if (response.ok) {
          response.json().then((json) => {
            if (this._validate(json)) {
              const resourceName = this.get('resourceName');
              const _json = json[resourceName] ? json[resourceName] : json;

              // DeviseTokenAuth: now add accessToken, client
              _json.accessToken = response.headers.get('access-token');
              _json.client = response.headers.get('client');

              run(null, resolve, _json);
            } else {
              run(null, reject, `Check that server response includes ${tokenAttributeName} and ${identificationAttributeName}`);
            }
          });
        } else {
          if (useResponse) {
            run(null, reject, response);
          } else {
            response.json().then((json) => run(null, reject, json));
          }
        }
      }).catch((error) => run(null, reject, error));
    });
  },

  // Validate that 'client' is also in the given data
  _validate(data) {
    const resourceName = this.get('resourceName');
    const _data = data[resourceName] ? data[resourceName] : data;
    return !isEmpty(_data.client) && this._super(...arguments);
  }
});
