Ember.SimpleAuth.LoginControllerMixin = Ember.Mixin.create({
  refreshToken: function(refreshToken) {
    var self     = this;
    var postData = ['grant_type=refresh_token', 'refresh_token=' + refreshToken].join('&');
    Ember.$.ajax(Ember.SimpleAuth.serverTokenRoute, {
      type:        'POST',
      data:        postData,
      contentType: 'application/x-www-form-urlencoded'
    }).then(function(response) {
      self.get('session').setup(response);
      self.scheduleTokenRefresh(response);
    });
  },
  scheduleTokenRefresh: function(response) {
    response            = response || {};
    var tokenExpiration = response.expires_in || 0;
    if (!Ember.isEmpty(response.refresh_token) && tokenExpiration - 10 > 0) {
      Ember.run.cancel(this.refreshTokenLater);
      this.refreshTokenLater = Ember.run.later(this, response.refresh_token, tokenExpiration - 10);
    }
  },
  actions: {
    login: function() {
      var self = this;
      var data = this.getProperties('identification', 'password');
      if (!Ember.isEmpty(data.identification) && !Ember.isEmpty(data.password)) {
        var postData = ['grant_type=password', 'username=' + data.identification, 'password=' + data.password].join('&');
        Ember.$.ajax(Ember.SimpleAuth.serverTokenRoute, {
          type:        'POST',
          data:        postData,
          contentType: 'application/x-www-form-urlencoded'
        }).then(function(response) {
          self.get('session').setup(response);
          self.scheduleTokenRefresh(response);
          self.send('loginSucceeded');
        }, function(xhr, status, error) {
          self.send('loginFailed', xhr, status, error);
        });
      }
    }
  }
});
