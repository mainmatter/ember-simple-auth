import Ember from 'ember';
import Base from './base';

/**
  Authorizer that conforms to OAuth 2
  ([RFC 6749](http://tools.ietf.org/html/rfc6749)) by sending a bearer token
  ([RFC 6750](http://tools.ietf.org/html/rfc6750)) in the request's
  `Authorization` header.

  _The factory for this authorizer is registered as
  `'simple-auth-authorizer:oauth2-bearer'` in Ember's container._

  @class OAuth2Bearer
  @namespace Authorizers
  @module authorizers/oauth2-bearer
  @extends Base
  @public
*/
export default Base.extend({
  /**
    Authorizes an XHR request by sending the `access_token` property from the
    session as a bearer token in the `Authorization` header:

    ```
    Authorization: Bearer <access_token>
    ```

    @method authorize
    @param {Function} block The block to call with the authoriztion data if the session is authenticated and authorization data is actually present
    @public
  */
  authorize(block) {
    let accessToken = this.get('session.secure.access_token');
    if (this.get('session.isAuthenticated') && !Ember.isEmpty(accessToken)) {
      block('Authorization', `Bearer ${accessToken}`);
    }
  }
});
