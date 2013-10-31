Ember.SimpleAuth.LoginControllerMixin = Ember.Mixin.create({
  tokenRequestOptions: function(username, password) {
    var postData = ['grant_type=password', 'username=' + username, 'password=' + password].join('&');
    return { type: 'POST', data: postData, contentType: 'application/x-www-form-urlencoded' };
  },
  actions: {
    login: function() {
      var self = this;
      var data = this.getProperties('identification', 'password');
      if (!Ember.isEmpty(data.identification) && !Ember.isEmpty(data.password)) {
        var requestOptions = this.tokenRequestOptions(data.identification, data.password);
        Ember.$.ajax(Ember.SimpleAuth.serverURL, requestOptions).then(function(response) {
          self.get('session').setup(response);
          self.send('loginSucceeded');
        }, function(xhr, status, error) {
          self.send('loginFailed', xhr, status, error);
        });
      }
    }
  }
});
