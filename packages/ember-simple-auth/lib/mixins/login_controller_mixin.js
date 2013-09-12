Ember.SimpleAuth.LoginControllerMixin = Ember.Mixin.create({
  actions: {
    login: function() {
      var self = this;
      var data = this.getProperties('identification', 'password');
      if (!Ember.isEmpty(data.identification) && !Ember.isEmpty(data.password)) {
        var postData = JSON.stringify({ session: { identification: data.identification, password: data.password } });
        Ember.$.post(Ember.SimpleAuth.serverSessionRoute, postData, null, 'json').then(function(response) {
          var sessionData = (response.session || {});
          self.get('session').setProperties(sessionData);
          Ember.tryInvoke(self, 'loginSucceeded');
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
