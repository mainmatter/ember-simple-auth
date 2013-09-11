Ember.SimpleAuth.LoginControllerMixin = Ember.Mixin.create({
  actions: {
    login: function() {
      var self = this;
      var data = this.getProperties('identification', 'password');
      if (!Ember.isEmpty(data.identification) && !Ember.isEmpty(data.password)) {
        var postData = { session: { identification: data.identification, password: data.password } };
        Ember.$.post(Ember.SimpleAuth.serverSessionRoute, postData).then(function(response) {
          var sessionData = (response.session || {});
          self.get('session').setProperties(sessionData);
          var attemptedTransition = self.get('session.attemptedTransition');
          if (attemptedTransition) {
            attemptedTransition.retry();
            self.set('session.attemptedTransition', null);
          } else {
            self.transitionToRoute(Ember.SimpleAuth.routeAfterLogin);
          }
        }, function() {
          self.send('loginFailed', arguments);
        });
      }
    }
  }
});
