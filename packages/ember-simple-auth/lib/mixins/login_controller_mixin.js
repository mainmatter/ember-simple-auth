/**
  The mixin for the login controller. This controller sends the user's credentials to the
  server and with the response sets up the current session (see {{#crossLink "Ember.SimpleAuth.Session/setup:method"}}Session.setup{{/crossLink}}).

  @class LoginControllerMixin
  @namespace Ember.SimpleAuth
  @extends Ember.Mixin
  @static
*/
Ember.SimpleAuth.LoginControllerMixin = Ember.Mixin.create({
  /**
    This method takes the user's credentials and builds the request options as they are passed
    Ember.$.ajax (see http://api.jquery.com/jQuery.ajax/). The default implementation follows
    RFC 6749. In case you're using a custom server API you would want to override this method:

    ```javascript
    App.LoginController  = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin, {
      tokenRequestOptions: function(username, password) {
        var putData = '{ "SESSION": { "USER_NAME": "' + username + '", "PASS": "' + password + '" } }';
        return { type: 'PUT', data: putData, contentType: 'application/json' };
      }
    });
    ```

    @method tokenRequestOptions
    @param {String} identification The user's identification (user name or email address or whatever is used to identify the user)
    @param {String} password The user's password
    @return {Object} The request options to be passed to Ember.$.ajax (see http://api.jquery.com/jQuery.ajax/ for detailed documentation)
  */
  tokenRequestOptions: function(identification, password) {
    var postData = ['grant_type=password', 'username=' + identification, 'password=' + password].join('&');
    return { type: 'POST', data: postData, contentType: 'application/x-www-form-urlencoded' };
  },
  actions: {
    /**
      @private
    */
    login: function() {
      var self = this;
      var data = this.getProperties('identification', 'password');
      if (!Ember.isEmpty(data.identification) && !Ember.isEmpty(data.password)) {
        var requestOptions = this.tokenRequestOptions(data.identification, data.password);
        Ember.$.ajax(Ember.SimpleAuth.serverTokenEndpoint, requestOptions).then(function(response) {
          self.get('session').setup(response);
          self.send('loginSucceeded');
        }, function(xhr, status, error) {
          self.send('loginFailed', xhr, status, error);
        });
      }
    }
  }
});
