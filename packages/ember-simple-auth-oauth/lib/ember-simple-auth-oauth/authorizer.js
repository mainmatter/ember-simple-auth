var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import { isSecureUrl } from './utils/is_secure_url';

/**
  Authorizer that conforms to OAuth 2
  ([RFC 6749](http://tools.ietf.org/html/rfc6749)) by sending a bearer token
  ([RFC 6749](http://tools.ietf.org/html/rfc6750)) in the request's
  `Authorization` header.

  @class OAuth2
  @namespace Authorizers
  @extends Authorizer
*/
var OAuth2 = Ember.SimpleAuth.Authorizer.extend({
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
    if (this.get('session.isAuthenticated') && !Ember.isEmpty(this.get('session.access_token'))) {
      if (!isSecureUrl(requestOptions.url)) {
        Ember.Logger.warn('Credentials are transmitted via an insecure connection - use HTTPS to keep them secure.');
      }
      jqXHR.setRequestHeader('Authorization', 'Bearer ' + this.get('session.access_token'));
    }
  }
});

export { OAuth2 };
