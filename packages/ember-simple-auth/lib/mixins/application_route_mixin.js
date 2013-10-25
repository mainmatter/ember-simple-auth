Ember.SimpleAuth.ApplicationRouteMixin = Ember.Mixin.create({
  actions: {
    login: function() {
      this.transitionTo(Ember.SimpleAuth.loginRoute);
    },

    loginSucceeded: function() {
      var attemptedTransition = this.get('session.attemptedTransition');
      if (attemptedTransition) {
        attemptedTransition.retry();
        this.set('session.attemptedTransition', undefined);
      } else {
        this.transitionTo(Ember.SimpleAuth.routeAfterLogin);
      }
    },

    loginFailed: function() {
    },

    logout: function() {
      this.get('session').destroy();
      this.transitionTo(Ember.SimpleAuth.routeAfterLogout);
    }
  }
});
