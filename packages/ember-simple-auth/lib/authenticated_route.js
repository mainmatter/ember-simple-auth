/**
@module simple-auth
*/

Ember.SimpleAuth.AuthenticatedRoute = Ember.Mixin.create({
  redirectToLogin: function(transition) {
    this.get('session').set('attemptedTransition', transition);
    this.transitionTo('login');
  },
  beforeModel: function(transition) {
    if (!this.get('session.authToken')) {
      this.redirectToLogin(transition);
    }
  }
});
