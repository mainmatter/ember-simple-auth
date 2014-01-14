'use strict';

/**
  The mixin for routes that should require an authenticated session in order to
  be accessible to users. Including this mixin in a route will automatically
  add hooks that enforce the session to be authenticated and redirect to
  `authenticationRoute` specified in
  [Ember.SimpleAuth.setup](#Ember.SimpleAuth_setup) if not.

  `Ember.SimpleAuth.AuthenticatedRouteMixin` performs the redirect in the
  `beforeModel` method so that in all methods executed after that an
  authenticated session can be assumed. If `beforeModel` is overridden, ensure
  that the custom implementation calls `this._super(transition)` so that the
  session enforcement code is executed.

  @class AuthenticatedRouteMixin
  @namespace Ember.SimpleAuth
  @extends Ember.Mixin
  @static
*/
Ember.SimpleAuth.AuthenticatedRouteMixin = Ember.Mixin.create({
  /**
    This method implements the enforcement of an authenticated session. If the
    session is not authenticated, the current transition will be aborted and a
     redirect will be triggered to `authenticationRoute` specified in
    [Ember.SimpleAuth.setup](#Ember.SimpleAuth_setup). The method also saves
    the intercepted transition so that it can be retried after the session has
    been authenticated (see
    [ApplicationRouteMixin#sessionAuthenticationSucceeded](#Ember.SimpleAuth.ApplicationRouteMixin_sessionAuthenticationSucceeded)).

    @method beforeModel
    @param {Transition} transition The transition that leat to this route
  */
  beforeModel: function(transition) {
    if (!this.get('session.isAuthenticated')) {
      transition.abort();
      this.triggerSessionAuthentication(transition);
    }
  },

  /**
    @method triggerSessionAuthentication
    @private
  */
  triggerSessionAuthentication: function(transition) {
    this.set('session.attemptedTransition', transition);
    transition.send('authenticateSession');
  }
});
