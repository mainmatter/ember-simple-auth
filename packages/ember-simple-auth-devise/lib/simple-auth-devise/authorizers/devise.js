import Base from 'simple-auth/authorizers/base';
import isSecureUrl from 'simple-auth/utils/is-secure-url';
import Configuration from './../configuration';

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
    The token attribute name

    This value can be configured via
    [`SimpleAuth.Configuration.Devise#tokenAttributeName`](#SimpleAuth-Configuration-Devise-tokenAttributeName).

    @property tokenAttributeName
    @type String
    @default 'user_token'
  */
  tokenAttributeName: 'user_token',

  /**
    The email attribute name

    This value can be configured via
    [`SimpleAuth.Configuration.Devise#identificationAttributeName`](#SimpleAuth-Configuration-Devise-identificationAttributeName).

    @property identificationAttributeName
    @type String
    @default 'user_email'
  */
  identificationAttributeName: 'user_email',

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

  /**
    @method init
    @private
  */
  init: function() {
    this.tokenAttributeName          = Configuration.tokenAttributeName;
    this.identificationAttributeName = Configuration.identificationAttributeName;
  },

  authorize: function(jqXHR, requestOptions) {
    var userToken = this.get('session.' + this.tokenAttributeName);
    var userEmail = this.get('session.' + this.identificationAttributeName);
    if (this.get('session.isAuthenticated') && !Ember.isEmpty(userToken) && !Ember.isEmpty(userEmail)) {
      if (!isSecureUrl(requestOptions.url)) {
        Ember.Logger.warn('Credentials are transmitted via an insecure connection - use HTTPS to keep them secure.');
      }
      var authData = 'token="' + userToken + '", user_email="' + userEmail + '"';
      jqXHR.setRequestHeader('Authorization', 'Token ' + authData);
    }
  }
});
