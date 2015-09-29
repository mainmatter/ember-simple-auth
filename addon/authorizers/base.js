import Ember from 'ember';

/**
  The base class for all authorizers. __This serves as a starting point for
  implementing custom authorizers and must not be used directly.__

  Authorizers use the session data aqcuired by an authenticator when
  authenticating the session to construct authrorization data that can e.g. be
  injected into outgoing network requests etc. Depending on the authorization
  mechanism the authorizer implements, that authorization data might be an HTTP
  header, query string parameters in the URL, cookies etc. __The authorizer has
  to fit the authenticator__ (see
  {{#crossLink "BaseAuthenticator"}}{{/crossLink}})
  as it relies on data that the authenticator acquires during authentication.

  @class BaseAuthorizer
  @module ember-simple-auth/authorizers/base
  @extends Ember.Object
@public
*/
export default Ember.Object.extend({
  /**
    The session the authorizer gets the data it needs to authorize requests
    from.

    @property session
    @readOnly
    @type InernalSession
    @default the session instance
    @public
  */
  session: null,

  /**
    Authorizes an XHR request by adding some sort of secret information that
    allows the server to identify the user making the request (e.g. a token in
    the `Authorization` header or some other secret in the query string etc.).

    `SimpleAuth.Authorizers.Base`'s implementation does nothing.

    @method authorize
    @param {Object} data The data that the session currently holds
    @param {Function} block The callback to call with the authorization data
    @public
  */
  authorize() {}
});
