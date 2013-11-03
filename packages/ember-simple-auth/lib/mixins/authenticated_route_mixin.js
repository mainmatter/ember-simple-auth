/**
  The mixin for routes that you want to enforce an authenticated user. When
  users hit a route that implements this mixin and have not authenticated
  before, they will be redirected to the route configured as `loginRoute` in
  [Ember.SimpleAuth.setup](#Ember.SimpleAuth_setup).

  Ember.SimpleAuth.AuthenticatedRouteMixin performs the redirect to the login
  route in the `beforeModel` method so that you can assume a user to be
  authenticated in the `model` method so that server requests you make there
  will be authenticated. Also, if you implement your own `beforeModel` method,
  you have to make sure you're calling `this._super(transition)`;

  @class AuthenticatedRouteMixin
  @namespace Ember.SimpleAuth
  @extends Ember.Mixin
  @static
*/
Ember.SimpleAuth.AuthenticatedRouteMixin = Ember.Mixin.create({
  /**
    This method implements the check for an authenticated user. In the case that
    no user is authenticated, it redirects to the route defined as `loginRoute`
    in [Ember.SimpleAuth.setup](#Ember.SimpleAuth_setup). It also intercepts the
    current transition so that it can be retried after the user has
    authenticated (see
    [ApplicationRouteMixin#loginSucceeded](#Ember.SimpleAuth.ApplicationRouteMixin_loginSucceeded)).

    @method beforeModel
    @param {Transition} transition The transition that leat to this route
  */
  beforeModel: function(transition) {
    if (!this.get('session.isAuthenticated')) {
      transition.abort();
      this.triggerLogin(transition);
    }
  },

  /**
    @method triggerLogin
    @private
    @param {Transition} transition The transition that leat to this route
  */
  triggerLogin: function(transition) {
    this.set('session.attemptedTransition', transition);
    if (Ember.canInvoke(transition, 'send')) {
      transition.send('login');
    } else {
      this.send('login');
    }
  }
});
