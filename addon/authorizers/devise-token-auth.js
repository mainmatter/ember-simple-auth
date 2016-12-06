import Ember from 'ember';
import DeviseAuthorizer from './devise';

const { getProperties, Array: { isEvery }, isPresent } = Ember;

/**
  Authorizer that works with the Ruby gem
  [devise_token_auth](https://github.com/lynndylanhurley/devise_token_auth).

  @class DeviseTokenAuthAuthorizer
  @module ember-simple-auth/authorizers/devise-token-auth
  @extends DeviseAuthorizer
  @public
*/
export default DeviseAuthorizer.extend({
  /**
   Includes the user's token (see
   {{#crossLink "DeviseAuthenticator/tokenAttributeName:property"}}{{/crossLink}})
   and identification (see
   {{#crossLink "DeviseAuthenticator/identificationAttributeName:property"}}{{/crossLink}})
   in the `Authorization` header.
   @method authorize
   @param {Object} data The data that the session currently holds
   @param {Function} block(headers) The callback to call with the authorization data;
   will receive the header names and header contents as an Object
   @public
   */
  authorize(data, block) {
    const { client, accessToken, uid } = getProperties(data, 'client', 'accessToken', 'uid');
    if (isEvery([client, accessToken, uid], isPresent)) {
      const authorizationHeaders = {
        client,
        uid,
        'access-token': accessToken
      };
      block(authorizationHeaders);
    }
  }
});
