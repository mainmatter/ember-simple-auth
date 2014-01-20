'use strict';

/**
  The mixin for routes that require the session to be authenticated in order to
  be accessible. Including this mixin in a route will automatically add hooks
  that enforce the session to be authenticated and redirect to
  the `authenticationRoute` specified in
  [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup) if not.

  `Ember.SimpleAuth.AuthenticatedRouteMixin` performs the redirect in the
  `beforeModel` method so that in all methods executed after that the session
  is guaranteed to be authenticated. __If `beforeModel` is overridden, ensure
  that the custom implementation calls `this._super(transition)`__ so that the
  session enforcement code is actually executed.

  @class AuthenticatedRouteMixin
  @namespace Ember.SimpleAuth
  @extends Ember.Mixin
  @static
*/
Ember.SimpleAuth.AuthenticatedRouteMixin = Ember.Mixin.create({
  /**
    This method implements the enforcement of the session being authenticated.
    If the session is not authenticated, the current transition will be aborted
    and a redirect will be triggered to the `authenticationRoute` specified in
    [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup). The method also saves
    the intercepted transition so that it can be retried after the session has
    been authenticated (see
    [Ember.SimpleAuth.ApplicationRouteMixin#sessionAuthenticationSucceeded](#Ember-SimpleAuth-ApplicationRouteMixin-sessionAuthenticationSucceeded)).

    @method beforeModel
    @param {Transition} transition The transition that lead to this route
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
