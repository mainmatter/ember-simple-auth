Ember.SimpleAuth.LoginController = Ember.Mixin.create({
  actions: {
    login: function() {
      var self = this;
      var data = this.getProperties('identification', 'password');
      if (!Ember.isEmpty(data.identification) && !Ember.isEmpty(data.password)) {
        var postData = { session: { identification: data.identification, password: data.password } };
        Ember.$.post(Ember.SimpleAuth.serverSessionRoute, postData).then(function(response) {
          var sessionData = (response.session || {});
          this.set('session.authToken', sessionData.auth_token);
          var attemptedTransition = this.get('session.attemptedTransition');
          if (attemptedTransition) {
            attemptedTransition.retry();
            this.set('session.attemptedTransition', null);
          } else {
            self.transitionToRoute('index');
          }
        });
      }
    }
  }
});
