'use strict';

/**
  The base for all authorizers. This serves as a starting point for
  implementing custom authorizers and must not be used directly.

  @class Base
  @namespace Ember.SimpleAuth.Authorizers
  @extends Ember.Object
  @constructor
*/
Ember.SimpleAuth.Authorizers.Base = Ember.Object.extend({
  /**
    The application session the authorizer get access tokens etc. from.

    @property session
    @type Ember.SimpleAuth.Session
    @default null
  */
  session: null,

  /**
    Authorizes an XHR request by adding some sort of secret information that
    allows the server to identify the user making the request (e.g. a token in
    the `Authorization` header or some other secret in the query string etc.).

    `Ember.SimpleAuth.Authorizers.Base`'s implementation does nothing as
    there's no reasonable default behavior (for Ember.SimpleAuth's default
    authorizer see Ember.SimpleAuth.Authorizers.OAuth2).

    @method authorize
    @param {jqXHR} jqXHR The XHR request to authorize (see http://api.jquery.com/jQuery.ajax/#jqXHR)
    @param {Object} requestOptions The options as provided to the `$.ajax` method (see http://api.jquery.com/jQuery.ajaxPrefilter/)
  */
  authorize: function(jqXHR, requestOptions) {
  }
});
