var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

/**
  Authenticator that works with the Ruby gem
  [Devise](https://github.com/plataformatec/devise) by adding `auth-token` and
  `auth-email` headers to requests.

  __As token authentication is not actually part of devise anymore, the server
  needs to implement some customizations__ to work with this authenticator -
  see the README and
  [discussion here](https://gist.github.com/josevalim/fb706b1e933ef01e4fb6).

  _The factory for this authorizer is registered as
  `'ember-simple-auth-authorizer:devise'` in Ember's container._

  @class Devise
  @namespace Authorizers
  @extends Base
*/
var Devise = Ember.SimpleAuth.Authorizers.Base.extend({
  /**
    Authorizes an XHR request by sending the `auth_token` and `auth_email`
    properties from the session in custom headers:

    ```
    auth-token: <auth_token>
    auth-email: <auth_email>
    ```

    @method authorize
    @param {jqXHR} jqXHR The XHR request to authorize (see http://api.jquery.com/jQuery.ajax/#jqXHR)
    @param {Object} requestOptions The options as provided to the `$.ajax` method (see http://api.jquery.com/jQuery.ajaxPrefilter/)
  */

  authorize: function(jqXHR, requestOptions) {
    var authToken = this.get('session.auth_token');
    var authEmail = this.get('session.auth_email');
    if (this.get('session.isAuthenticated') && !Ember.isEmpty(authToken) && !Ember.isEmpty(authEmail)) {
      if (!Ember.SimpleAuth.Utils.isSecureUrl(requestOptions.url)) {
        Ember.Logger.warn('Credentials are transmitted via an insecure connection - use HTTPS to keep them secure.');
      }
      jqXHR.setRequestHeader('auth-token', authToken);
      jqXHR.setRequestHeader('auth-email', authEmail);
    }
  }
});

export { Devise };
