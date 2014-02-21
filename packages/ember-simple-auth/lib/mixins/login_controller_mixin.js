'use strict';

/**
  The mixin for the authentication controller that handles the
  `authenticationRoute` specified in
  [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup)). It provides the
  `authenticate` action that will authenticate the session with the configured
  authenticator when invoked. __This is a specialization of
  [Ember.SimpleAuth.AuthenticationControllerMixin](#Ember-SimpleAuth-AuthenticationControllerMixin)
  for authentication mechanisms that work like a regular login with
  credentials.__

  Accompanying the controller that this mixin is mixed in the application needs
  to have a `login` template with the fields `indentification` and `password`
  as well as an actionable button or link that triggers the `authenticate`
  action, e.g.:

  ```handlebars
  <form {{action 'authenticate' on='submit'}}>
    <label for="identification">Login</label>
    {{input id='identification' placeholder='Enter Login' value=identification}}
    <label for="password">Password</label>
    {{input id='password' placeholder='Enter Password' type='password' value=password}}
    <button type="submit">Login</button>
  </form>
  ```

  @class LoginControllerMixin
  @namespace Ember.SimpleAuth
  @extends Ember.SimpleAuth.AuthenticationControllerMixin
*/
Ember.SimpleAuth.LoginControllerMixin = Ember.Mixin.create(Ember.SimpleAuth.AuthenticationControllerMixin, {
  /**
    The authenticator class used to authenticate the session.

    @property authenticator
    @type Ember.SimpleAuth.Authenticators.Base
    @default Ember.SimpleAuth.Authenticators.OAuth2
  */
  authenticator: 'ember-simple-auth:authenticators:oauth2',

  actions: {
    /**
      This action will authenticate the session with an instance of the
      configured `authenticator` class if both `identification` and `password`
      are non-empty. It passes both values to the authenticator.

      _The action also resets the `password` property so sensitive data is not
      stored anywhere for longer than necessary._

      @method actions.authenticate
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
