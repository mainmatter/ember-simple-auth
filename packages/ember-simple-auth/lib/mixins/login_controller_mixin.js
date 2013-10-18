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
        Ember.$.ajax(Ember.SimpleAuth.serverSessionRoute, {
          type:        'POST',
          data:        postData,
          contentType: 'application/json'
        }).then(function(response) {
          self.get('session').setup(response);
          self.send('loginSucceeded');
        }, function() {
          Ember.tryInvoke(self, 'externalLoginSucceededCallback', arguments);
        });
      }
    }
  }
});
