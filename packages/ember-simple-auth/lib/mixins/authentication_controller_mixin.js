'use strict';

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

  @class AuthenticationControllerMixin
  @namespace Ember.SimpleAuth
  @extends Ember.Mixin
  @static
*/
Ember.SimpleAuth.AuthenticationControllerMixin = Ember.Mixin.create({
  authenticator: Ember.SimpleAuth.Authenticators.OAuth2,

  actions: {
    /**
      @method actions.authenticate
      @private
    */
    authenticate: function() {
      var _this = this;
      var data = this.getProperties('identification', 'password');
      if (!Ember.isEmpty(data.identification) && !Ember.isEmpty(data.password)) {
        this.set('password', null);
        this.get('session').authenticate(this.get('authenticator').create(), data).then(function() {
          _this.send('sessionAuthenticationSucceeded');
        }, function(error) {
          _this.send('sessionAuthenticationFailed', error);
        });
      }
    }
  }
});
