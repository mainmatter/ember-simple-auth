var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import Configuration from './../configuration';

/**
  This mixin is for the controller that handles the
  [`Configuration.authenticationRoute`](#SimpleAuth-Configuration-authenticationRoute).
  It provides the `authenticate` action that will authenticate the session with
  the configured authenticator (see
  [`AuthenticationControllerMixin#authenticatorFactory`](#SimpleAuth-AuthenticationControllerMixin-authenticatorFactory)).

  @class AuthenticationControllerMixin
  @namespace SimpleAuth
  @module simple-auth/mixins/authentication-controller-mixin
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
      [`AuthenticationControllerMixin#authenticatorFactory`](#SimpleAuth-AuthenticationControllerMixin-authenticatorFactory),
      [`Session#authenticate`](#SimpleAuth-Session-authenticate)).

      @method actions.authenticate
      @param {Object} options Any options the authenticator needs to authenticate the session
    */
    authenticate: function(options) {
      var authenticatorFactory = this.get('authenticatorFactory');
      Ember.assert('AuthenticationControllerMixin/LoginControllerMixin require the authenticatorFactory property to be set on the controller', !Ember.isEmpty(authenticatorFactory));
      return this.get(Configuration.sessionPropertyName).authenticate(this.get('authenticatorFactory'), options);
    }
  }
});
