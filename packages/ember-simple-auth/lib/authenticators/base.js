'use strict';

/**
  The base for all authenticators. This serves as a starting point for
  implementing custom authenticators and must not be used directly.

  Authenticators may trigger the 'ember-simple-auth:session-updated' event when
  any of the session properties change. The session listens to that event and
  will handle the change accordingly.

  @class Base
  @namespace Ember.SimpleAuth.Authenticators
  @extends Ember.Object
  @uses Ember.Evented
*/
Ember.SimpleAuth.Authenticators.Base = Ember.Object.extend(Ember.Evented, {
  /**
    Restores the session from a set of session properties. This method is
    invoked by the session either after the applciation starts up and session
    properties where restored from the store or when properties in the store
    have changed due to external actions (e.g. in another tab).

    This method returns a promise. A resolving promise will result in the
    session being authenticated. Any properties the promise resolves with will
    be saved by and accessible via the session. In most cases the `properties`
    argument will simply be forwarded to the promise. A rejecting promise
    indicates that authentication failed and the session will remain unchanged.

    `Ember.SimpleAuth.Authenticators.Base`'s always rejects as there's no
    reasonable default implementation.

    @method restore
    @param {Object} properties The properties to restore the session from
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
  */
  restore: function(properties) {
    return new Ember.RSVP.Promise(function(resolve, reject) { reject(); });
  },

  /**
    Authenticates the session with the specified `options`. These options vary
    depending on the actual authentication mechanism the authenticator uses
    (e.g. a set of credentials or a Facebook account id etc.). The session will
    invoke this method when some action in the appliaction triggers
    authentication (see AuthenticationControllerMixin.actions.authenticate).

    This method returns a promise. A resolving promise will result in the
    session being authenticated. Any properties the promise resolves with will
    be saved by and accessible via the session. A rejecting promise indicates
    that authentication failed and the session will remain unchanged.

    `Ember.SimpleAuth.Authenticators.Base`'s implementation always returns a
    rejecting promise and thus never authenticates the session as there's no
    reasonable default behavior (for Ember.SimpleAuth's default authenticator
    see Ember.SimpleAuth.Authenticators.OAuth2).

    @method authenticate
    @param {Object} options The options to authenticate the session with
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
  */
  authenticate: function(options) {
    return new Ember.RSVP.Promise(function(resolve, reject) { reject(); });
  },

  /**
    Invalidation callback that is invoked when the session is invalidated.
    While the session will invalidate itself and clear all session properties,
    it might be necessary for some authenticators to perform additional tasks
    (e.g. invalidating an access token on the server), which should be done in
    this method.

    This method returns a promise. A resolving promise will result in the
    session being invalidated. A rejecting promise will result in the session
    invalidation being intercepted and the session being left authenticated.

    `Ember.SimpleAuth.Authenticators.Base`'s implementation always returns a
    resolving promise and thus always invalidates the session without doing
    anything.

    @method invalidate
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being invalidated
  */
  invalidate: function() {
    return new Ember.RSVP.Promise(function(resolve) { resolve(); });
  }
});
