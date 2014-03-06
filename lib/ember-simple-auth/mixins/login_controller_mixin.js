var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import { AuthenticationControllerMixin } from './authentication_controller_mixin';
import { OAuth2 } from '../authenticators/oauth2';

/**
  The mixin for the authentication controller that handles the
  `authenticationRoute` specified in
  [EmberSimpleAuth.setup](#EmberSimpleAuth-setup)). It provides the
  `authenticate` action that will authenticate the session with the configured
  authenticator when invoked. __This is a specialization of
  [EmberSimpleAuth.AuthenticationControllerMixin](#EmberSimpleAuth-AuthenticationControllerMixin)
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
  @extends EmberSimpleAuth.AuthenticationControllerMixin
*/
var LoginControllerMixin = Ember.Mixin.create(AuthenticationControllerMixin, {
  /**
    The authenticator class used to authenticate the session.

    @property authenticator
    @type EmberSimpleAuth.Authenticators.Base
    @default EmberSimpleAuth.Authenticators.OAuth2
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

export { LoginControllerMixin };
