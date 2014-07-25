import Base from 'simple-auth/authorizers/base';
import isSecureUrl from 'simple-auth/utils/is-secure-url';

/**
  Authenticator that works with the Ruby gem
  [Devise](https://github.com/plataformatec/devise) by sending the `user_token`
  and `user_email` properties from the session in the `Authorization` header.

  __As token authentication is not actually part of devise anymore, the server
  needs to implement some customizations__ to work with this authenticator -
  see the README for more information.

  _The factory for this authorizer is registered as
  `'simple-auth-authorizer:devise'` in Ember's container._

  @class Devise
  @namespace SimpleAuth.Authorizers
  @module simple-auth-devise/authorizers/devise
  @extends Base
*/
export default Base.extend({
  /**
    Authorizes an XHR request by sending the `user_token` and `user_email`
    properties from the session in the `Authorization` header:

    ```
    Authorization: Token token="<user_token>", user_email="<user_email>"
    ```

    @method authorize
    @param {jqXHR} jqXHR The XHR request to authorize (see http://api.jquery.com/jQuery.ajax/#jqXHR)
    @param {Object} requestOptions The options as provided to the `$.ajax` method (see http://api.jquery.com/jQuery.ajaxPrefilter/)
  */

  authorize: function(jqXHR, requestOptions) {
    var userToken = this.get('session.user_token');
    var userEmail = this.get('session.user_email');
    if (this.get('session.isAuthenticated') && !Ember.isEmpty(userToken) && !Ember.isEmpty(userEmail)) {
      if (!isSecureUrl(requestOptions.url)) {
        Ember.Logger.warn('Credentials are transmitted via an insecure connection - use HTTPS to keep them secure.');
      }
      var authData = 'token="' + userToken + '", user_email="' + userEmail + '"';
      jqXHR.setRequestHeader('Authorization', 'Token ' + authData);
    }
  }
});
