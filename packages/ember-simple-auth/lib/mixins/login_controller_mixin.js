Ember.SimpleAuth.LoginControllerMixin = Ember.Mixin.create({
  actions: {
    login: function() {
      var self = this;
      var data = this.getProperties('identification', 'password');
      if (!Ember.isEmpty(data.identification) && !Ember.isEmpty(data.password)) {
        var postData = ['grant_type=password', 'username=' + data.identification, 'password=' + data.password].join('&');
        Ember.$.ajax(Ember.SimpleAuth.serverSessionRoute, {
          type:        'POST',
          data:        postData,
          contentType: 'application/x-www-form-urlencoded'
        }).then(function(response) {
          self.get('session').setup(response);
          self.send('loginSucceeded');
        }, function(xhr, status, error) {
          self.send('loginFailed', xhr, status, error);
        });
      }
    }
  }
});
