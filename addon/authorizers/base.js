import Ember from 'ember';

/**
  The base for all authorizers. __This serves as a starting point for
  implementing custom authorizers and must not be used directly.__

  Authorizers use the session data aqcuired by the authenticator when
  authenticating the session to construct authrorization data that can then be
  used to authorize outgoing requests to APIs etc. The authorization data might
  be an HTTP header, query string parameters in the URL, cookies etc. __The
  authorizer has to fit the authenticator__ (see
  {{#crossLink "BaseAuthenticator"}}{{/crossLink}})
  as it relies on data that the authenticator acquires during authentication.

  While the session can always only be authenticated with one authenticator at
  a time, an application might use different authorizers to e.g. connect with
  different APIs.

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
    @type SimpleAuth.Session
    @default the session instance
    @public
  */
  session: null,

  /**
    Authorizes a block of code passed as a callback. If the session is
    authenticated and the data the authorizer needs to construct its specific
    authorization data is present, it calls the passed callback with that
    authorization data.

    `BaseAuthorizer`'s implementation does nothing.

    @method authorize
    @param {Function} block The callback to call with the authorization data
    @public
  */
  authorize() {}
});
