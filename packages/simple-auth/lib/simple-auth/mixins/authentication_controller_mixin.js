var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import Configuration from './../configuration';

/**
  The mixin for the controller that handles the `authenticationRoute` specified
  in [SimpleAuth.setup](#Ember-SimpleAuth-setup)). It provides the
  `authenticate` action that will authenticate the session with the configured
  authenticator (see
  [SimpleAuth.AuthenticationControllerMixin#authenticatorFactory](#Ember-SimpleAuth-AuthenticationControllerMixin-authenticatorFactory)).

  @class AuthenticationControllerMixin
  @namespace SimpleAuth
  @module simple-auth/mixins/authentication_controller_mixin
  @extends Ember.Mixin
*/
export default Ember.Mixin.create({
  /**
    The authenticator used to authenticate the session.

    @property authenticatorFactory
    @type String
    @default null
  */
  authenticatorFactory: null,

  actions: {
    /**
      This action will authenticate the session with the configured
      authenticator (see
      [SimpleAuth.AuthenticationControllerMixin#authenticatorFactory](#Ember-SimpleAuth-AuthenticationControllerMixin-authenticatorFactory),
      [SimpleAuth.Session#authenticate](#Ember-SimpleAuth-Session-authenticate)).

      @method actions.authenticate
      @param {Object} options Any options the authenticator needs to authenticate the session
    */
    authenticate: function(options) {
      return this.get(Configuration.sessionPropertyName).authenticate(this.get('authenticatorFactory'), options);
    }
  }
});
