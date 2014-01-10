'use strict';

/**
  Authorizer that conforms to OAuth 2 (RFC 6749) by adding bearer tokens to all
  requests (RFC 6750).

  @class OAuth2
  @namespace Ember.SimpleAuth.Authorizers
  @extends Ember.SimpleAuth.Authorizers.Base
  @constructor
*/
Ember.SimpleAuth.Authorizers.OAuth2 = Ember.SimpleAuth.Authorizers.Base.extend({
  /**
    Authorizes an XHR request by adding the `access_token` property from the
    session as a bearer token in the `Authorization` header:

    ```
    Authorization: Bearer <token>
    ```

    @method authorize
    @param {jqXHR} jqXHR The XHR request to authorize (see http://api.jquery.com/jQuery.ajax/#jqXHR)
    @param {Object} requestOptions The options as provided to the `$.ajax` method (see http://api.jquery.com/jQuery.ajaxPrefilter/)
  */
  authorize: function(jqXHR, requestOptions) {
    if (!Ember.isEmpty(this.get('session.access_token'))) {
      jqXHR.setRequestHeader('Authorization', 'Bearer ' + this.get('session.access_token'));
    }
  }
});
