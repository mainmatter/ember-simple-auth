var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

/**
  The base for all authorizers. __This serves as a starting point for
  implementing custom authorizers and must not be used directly.__

  __The authorizer preprocesses all XHR requests__ (expect ones to 3rd party
  origins, see [EmberSimpleAuth.setup](#Ember-SimpleAuth-setup)) and makes
  sure they have the required data attached that allows the server to identify
  the user making the request. This data might be a specific header, data in
  the query part of the URL, cookies etc. __The authorizer has to fit the
  authenticator__ (see
  [EmberSimpleAuth.Authenticators.Base](#Ember-SimpleAuth-Authenticators-Base))
  as it usually relies on data that the authenticator retrieves during
  authentication and that it makes available through the session.

  @class Base
  @namespace EmberSimpleAuth.Authorizers
  @extends Ember.Object
*/
var Base = Ember.Object.extend({
  /**
    The session the authorizer gets the data it needs to authorize requests
    from (see [EmberSimpleAuth.Session](#Ember-SimpleAuth-Session)).

    @property session
    @readOnly
    @type EmberSimpleAuth.Session
    @default null
  */
  session: null,

  /**
    Authorizes an XHR request by adding some sort of secret information that
    allows the server to identify the user making the request (e.g. a token in
    the `Authorization` header or some other secret in the query string etc.).

    `EmberSimpleAuth.Authorizers.Base`'s implementation does nothing as
    there's no reasonable default behavior (for EmberSimpleAuth's default
    authorizer see
    [EmberSimpleAuth.Authorizers.OAuth2](#Ember-SimpleAuth-Authorizers-OAuth2)).

    @method authorize
    @param {jqXHR} jqXHR The XHR request to authorize (see http://api.jquery.com/jQuery.ajax/#jqXHR)
    @param {Object} requestOptions The options as provided to the `$.ajax` method (see http://api.jquery.com/jQuery.ajaxPrefilter/)
  */
  authorize: function(jqXHR, requestOptions) {
  }
});

export { Base };
