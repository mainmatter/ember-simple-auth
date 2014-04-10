var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

/**
  Authorizer that conforms to Devise by sending an auth_token in the request's
  `auth-token` header.

  _The factory for this authorizer is registered as
  `'authorizer:devise'` in Ember's container.

  @class Devise
  @namespace Authorizers
  @extends Base
*/
var Devise = Ember.SimpleAuth.Authorizers.Base.extend({
  /**
    Authorizes an XHR request by sending the `auth_token` property from the
    session as a bearer token in the `Authorization` header:

    ```
    Authorization: Bearer <auth_token>
    ```

    @method authorize
    @param {jqXHR} jqXHR The XHR request to authorize (see http://api.jquery.com/jQuery.ajax/#jqXHR)
    @param {Object} requestOptions The options as provided to the `$.ajax` method (see http://api.jquery.com/jQuery.ajaxPrefilter/)
  */

  authorize: function(jqXHR, requestOptions) {
    if (!Ember.isEmpty(this.get('session.auth_token')) && !Ember.isEmpty(this.get('session.auth_email'))) {
      if (!Ember.SimpleAuth.Utils.isSecureUrl(requestOptions.url)) {
        Ember.Logger.warn('Credentials are transmitted via an insecure connection - use HTTPS to keep them secure.');
      }
      jqXHR.setRequestHeader('auth-token', this.get('session.auth_token'));
      jqXHR.setRequestHeader('auth-email', this.get('session.auth_email'));
    }
  }
});

export { Devise };
