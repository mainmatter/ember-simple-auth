/**
@module simple-auth
*/

Ember.SimpleAuth.LoginController = Ember.Mixin.create({
  actions: {
    login: function() {
      var self = this;
      var data = this.getProperties('identification', 'password');
      if (!Ember.isEmpty(data.identification) && !Ember.isEmpty(data.password)) {
        var postData = { session: { identification: data.identification, password: data.password } };
        Ember.$.post(SimpleAuth.baseUrl + '/session', postData).then(function(response) {
          var sessionData = (response.session || {})
          session.set('authToken', sessionData.auth_token);
          var attemptedTransition = session.get('attemptedTransition');
          if (attemptedTransition) {
            attemptedTransition.retry();
            session.set('attemptedTransition', null);
          } else {
            self.transitionToRoute('index');
          }
        });
      }
    }
  }
});
