Ember.SimpleAuth.ApplicationRouteMixin = Ember.Mixin.create({
  actions: {
    login: function() {
      this.transitionTo(Ember.SimpleAuth.loginRoute);
    },
    loginSucceeded: function() {
      var attemptedTransition = this.get('session.attemptedTransition');
      if (attemptedTransition) {
        attemptedTransition.retry();
        this.set('session.attemptedTransition', null);
      } else {
        this.transitionTo(Ember.SimpleAuth.routeAfterLogin);
      }
    },
    logout: function() {
      var self = this;
      Ember.$.ajax(Ember.SimpleAuth.serverSessionRoute, { type: 'DELETE' }).always(function(response) {
        self.get('session').destroy();
        self.transitionTo(Ember.SimpleAuth.routeAfterLogout);
      });
    }
  }
});
