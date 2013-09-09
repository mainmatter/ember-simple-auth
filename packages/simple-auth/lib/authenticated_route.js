SimpleAuth.AuthenticatedRoute = Ember.Mixin.extend({
  redirectToLogin: function(transition) {
    session.set('attemptedTransition', transition);
    this.transitionTo('login');
  },
  beforeModel: function(transition) {
    if (!session.get('authToken')) {
      this.redirectToLogin(transition);
    }
  }
});
