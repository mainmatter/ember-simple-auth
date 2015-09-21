/* jscs:disable requireDotNotation */
import Ember from 'ember';
import Base from './base';

const { isEmpty } = Ember;

/**
  Authorizer that conforms to OAuth 2
  ([RFC 6749](http://tools.ietf.org/html/rfc6749)) by sending a bearer token
  ([RFC 6750](http://tools.ietf.org/html/rfc6750)) in the `Authorization`
  header.

  @class OAuth2BearerAuhtorizer
  @module ember-simple-auth/authorizers/oauth2-bearer
  @extends BaseAuthorizer
  @public
*/
export default Base.extend({
  /**
    Puts the access token into the `Authorization` header as a Bearer token,
    e.g.:

    ```
    Authorization: Bearer <access_token>
    ```

    @method authorize
    @param {Object} data The data that the session currently holds
    @param {Function} block The block to call with the authoriztion data if the session is authenticated and authorization data is actually present
    @public
  */
  authorize(data, block) {
    const accessToken = data['access_token'];
    if (!isEmpty(accessToken)) {
      block('Authorization', `Bearer ${accessToken}`);
    }
  }
});
