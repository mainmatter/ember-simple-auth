Ember.SimpleAuth.LoginControllerMixin = Ember.Mixin.create({
  serializeCredentials: function(identification, password) {
    return { session: { identification: identification, password: password } };
  },
  actions: {
    login: function() {
      var self = this;
      var data = this.getProperties('identification', 'password');
      if (!Ember.isEmpty(data.identification) && !Ember.isEmpty(data.password)) {
        var postData = JSON.stringify(self.serializeCredentials(data.identification, data.password));
        Ember.$.post(Ember.SimpleAuth.serverSessionRoute, postData, null, 'json').then(function(response) {
          self.get('session').setup(response);
          var attemptedTransition = self.get('session.attemptedTransition');
          if (attemptedTransition) {
            attemptedTransition.retry();
            self.set('session.attemptedTransition', null);
          } else {
            self.transitionToRoute(Ember.SimpleAuth.routeAfterLogin);
          }
        }, function() {
          Ember.tryInvoke(self, 'loginFailed', arguments);
        });
      }
    }
  }
});
