'use strict';

/**
  The mixin for the authentication controller that handles the
  `authenticationRoute` specified in
  [Ember.SimpleAuth#setup](#Ember.SimpleAuth#setup)). It provides the
  `authenticate` action that will authenticate the session with the configured
  authenticator when invoked.

  Accompanying the login controller the application needs to have a `login`
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
*/
Ember.SimpleAuth.LoginControllerMixin = Ember.Mixin.create(Ember.SimpleAuth.AuthenticationControllerMixin, {
  /**
    The authenticator class used to authenticate the session.

    @property authenticator
    @type Ember.SimpleAuth.Authenticators.Base
    @default Ember.SimpleAuth.Authenticators.OAuth2
  */
  authenticator: Ember.SimpleAuth.Authenticators.OAuth2,

  actions: {
    /**
      This action will authenticate the session with an instance of the
      configured `authenticator` class. It will pass the `identification` and
      `password` properties to the athenticator.

      @method actions.authenticate
      @private
    */
    authenticate: function() {
      var data = this.getProperties('identification', 'password');
      if (!Ember.isEmpty(data.identification) && !Ember.isEmpty(data.password)) {
        this.set('password', null);
        this._super(data);
      }
    }
  }
});
