/**
  The base for all authorizers. __This serves as a starting point for
  implementing custom authorizers and must not be used directly.__

  __The authorizer preprocesses all XHR requests__ (except ones to 3rd party
  origins, see
  [Configuration.crossOriginWhitelist](#SimpleAuth-Configuration-crossOriginWhitelist))
  and makes sure they have the required data attached that allows the server to
  identify the user making the request. This data might be an HTTP header,
  query string parameters in the URL, cookies etc. __The authorizer has to fit
  the authenticator__ (see
  [SimpleAuth.Authenticators.Base](#SimpleAuth-Authenticators-Base))
  as it relies on data that the authenticator acquires during authentication.

  @class Base
  @namespace SimpleAuth.Authorizers
  @module simple-auth/authorizers/base
  @extends Ember.Object
*/
export default Ember.Object.extend({
  /**
    The session the authorizer gets the data it needs to authorize requests
    from.

    @property session
    @readOnly
    @type SimpleAuth.Session
    @default the session instance
  */
  session: null,

  /**
    Authorizes an XHR request by adding some sort of secret information that
    allows the server to identify the user making the request (e.g. a token in
    the `Authorization` header or some other secret in the query string etc.).

    `SimpleAuth.Authorizers.Base`'s implementation does nothing.

    @method authorize
    @param {jqXHR} jqXHR The XHR request to authorize (see http://api.jquery.com/jQuery.ajax/#jqXHR)
    @param {Object} requestOptions The options as provided to the `$.ajax` method (see http://api.jquery.com/jQuery.ajaxPrefilter/)
  */
  authorize: function(jqXHR, requestOptions) {
  }
});
