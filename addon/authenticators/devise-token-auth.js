import Ember from 'ember';
import DeviseAuthenticator from './devise';

const { RSVP, assert, getProperties, Array: { isEvery }, isPresent, run } = Ember;

/**
  Authenticator that works with the Ruby gem
  [devise_token_auth](https://github.com/lynndylanhurley/devise_token_auth).
  
  Read more about the [Token Header format](https://github.com/lynndylanhurley/devise_token_auth#token-header-format).

  @class DeviseTokenAuthAuthenticator
  @module ember-simple-auth/authenticators/devise-token-auth
  @extends DeviseAuthenticator
  @public
*/
export default DeviseAuthenticator.extend({
  /**
    The attribute in the session data that represents the authentication
    token.

    @property tokenAttributeName
    @type String
    @default 'accessToken'
    @public
  */
  tokenAttributeName: 'accessToken',
  
  /**
    The attribute in the session data that represents the authenticating
    user's identity.

    @property identificationAttributeName
    @type String
    @default 'email'
    @public
  */
  identificationAttributeName: 'email',

  /**
    The endpoint on the server that the authentication request is sent to.

    @property serverTokenEndpoint
    @type String
    @default null
    @public
  */
  serverTokenEndpoint: null,
  
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
    Asserts that required attributes `resourceName` and `serverTokenEndpoint`
    are set.

    @method init
    @public
  */
  init() {
    this._super(...arguments);
    assert('`resourceName` or `serverTokenEndpoint` missing',
      isEvery([this.get('resourceName'), this.get('serverTokenEndpoint')], isPresent)
    );
  },

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
    return new RSVP.Promise((resolve, reject) => {
        const data = { password };
        data[this.get('identificationAttributeName')] = identification;
        return this.makeRequest(data)
          .then((response, _, xhr) => {
            let responseData = response.data;
            responseData.accessToken = xhr.getResponseHeader('access-token');
            responseData.client = xhr.getResponseHeader('client');
            run(null, resolve, responseData);
          })
          .fail((xhr) => {
            console.error(xhr.responseJSON || xhr.responseText);
            run(null, reject, xhr.responseJSON || xhr.responseText);
          });
      }
    );
  },
  
  _validate(data) {
    const { accessToken, uid, client } = getProperties(data, 'accessToken', 'uid', 'client');
    return isEvery([accessToken, uid, client], isPresent);
  }
});
