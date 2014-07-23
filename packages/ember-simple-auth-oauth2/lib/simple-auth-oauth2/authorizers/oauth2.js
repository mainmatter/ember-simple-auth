import Base from 'simple-auth/authorizers/base';
import isSecureUrl from 'simple-auth/utils/is-secure-url';

/**
  Authorizer that conforms to OAuth 2
  ([RFC 6749](http://tools.ietf.org/html/rfc6749)) by sending a bearer token
  ([RFC 6749](http://tools.ietf.org/html/rfc6750)) in the request's
  `Authorization` header.

  _The factory for this authorizer is registered as
  `'simple-auth-authorizer:oauth2-bearer'` in Ember's container._

  @class OAuth2
  @namespace SimpleAuth.Authorizers
  @module simple-auth-devise/authorizers/oauth2
  @extends Base
*/
export default Base.extend({
  /**
    Authorizes an XHR request by sending the `access_token` property from the
    session as a bearer token in the `Authorization` header:

    ```
    Authorization: Bearer <access_token>
    ```

    @method authorize
    @param {jqXHR} jqXHR The XHR request to authorize (see http://api.jquery.com/jQuery.ajax/#jqXHR)
    @param {Object} requestOptions The options as provided to the `$.ajax` method (see http://api.jquery.com/jQuery.ajaxPrefilter/)
  */
  authorize: function(jqXHR, requestOptions) {
    var accessToken = this.get('session.access_token');
    if (this.get('session.isAuthenticated') && !Ember.isEmpty(accessToken)) {
      if (!isSecureUrl(requestOptions.url)) {
        Ember.Logger.warn('Credentials are transmitted via an insecure connection - use HTTPS to keep them secure.');
      }
      jqXHR.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    }
  }
});
