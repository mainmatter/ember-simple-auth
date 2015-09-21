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
    @param {Function} [block] The callback to call with the authorization data
    @param {String} block.headerName The name of the header (will be `Authorization`)
    @param {Object} block.headerContent The header content (will be `Bearer <access_token>`)
    @public
  */
  authorize(block) {
    const accessToken = this.get('session.authenticated.access_token');
    if (this.get('session.isAuthenticated') && !isEmpty(accessToken)) {
      block('Authorization', `Bearer ${accessToken}`);
    }
  }
});
