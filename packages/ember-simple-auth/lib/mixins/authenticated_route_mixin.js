/**
  The mixin for routes that require a user to be authenticated. When users hit a route that
  implements this mixin and have not authenticated before, they will be redirected to the route
  defined as `loginRoute` in {{#crossLink "Ember.SimpleAuth/setup:method"}}Ember.SimpleAuth.setup{{/crossLink}} (or `login` by default).

  @class AuthenticatedRouteMixin
  @namespace Ember.SimpleAuth
  @extends Ember.Mixin
  @static
*/
Ember.SimpleAuth.AuthenticatedRouteMixin = Ember.Mixin.create({
  /**
    This method implements the check for an authenticated user. In the case that no user is authenticated,
    it redirects to the route defined as `loginRoute` in {{#crossLink "Ember.SimpleAuth/setup:method"}}Ember.SimpleAuth.setup{{/crossLink}} (or `login` by default).
    It also intercepts the current transition so that it can be retried after the user
    has authenticated (see {{#crossLink "Ember.SimpleAuth.ApplicationRouteMixin/loginSucceeded:method"}}ApplicationRouteMixin.loginSucceeded{{/crossLink}}).

    @method beforeModel
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
