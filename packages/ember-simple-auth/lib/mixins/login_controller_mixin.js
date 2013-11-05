/**
  The mixin for the login controller (if you're using the default
  credentials-based login). This controller sends the user's credentials to the
  server and sets up the session (see
  [Session#setup](#Ember.SimpleAuth.Session_setup)) from the reponse.

  Accompanying the login controller your application needs to have a `login`
  template with the fields `indentification` and `password` as well as an
  actionable button or link that triggers the `login` action, e.g.:

  ```handlebars
  <form {{action login on='submit'}}>
    <label for="identification">Login</label>
    {{view Ember.TextField id='identification' valueBinding='identification' placeholder='Enter Login'}}
    <label for="password">Password</label>
    {{view Ember.TextField id='password' type='password' valueBinding='password' placeholder='Enter Password'}}
    <button type="submit">Login</button>
  </form>
  ```

  @class LoginControllerMixin
  @namespace Ember.SimpleAuth
  @extends Ember.Mixin
  @static
*/
Ember.SimpleAuth.LoginControllerMixin = Ember.Mixin.create({
  /**
    This method takes the user's credentials and builds the request options as
    they are passed Ember.$.ajax (see http://api.jquery.com/jQuery.ajax/).

    The default implementation follows RFC 6749. In case you're using a custom
    server API you can override this method to return options as they fit your
    server API, e.g.:

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
      @method login
      @private
    */
    login: function() {
      var self = this;
      var data = this.getProperties('identification', 'password');
      self.set('password', '');
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
