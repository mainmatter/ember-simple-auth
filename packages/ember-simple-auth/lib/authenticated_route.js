Ember.SimpleAuth.AuthenticatedRoute = Ember.Mixin.create({
  beforeModel: function(transition) {
    if (!this.get('session.isAuthenticated')) {
      this.redirectToLogin(transition);
    }
  },
  redirectToLogin: function(transition) {
    this.set('session.attemptedTransition', transition);
    this.transitionTo('login');
  }
});
