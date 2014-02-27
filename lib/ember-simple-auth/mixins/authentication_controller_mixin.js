var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

/**
  The mixin for the controller that handles the `authenticationRoute` specified
  in [EmberSimpleAuth.setup](#EmberSimpleAuth-setup)). It provides the
  `authenticate` action that will authenticate the session with the configured
  authenticator when invoked.

  @class AuthenticationControllerMixin
  @namespace EmberSimpleAuth
  @extends Ember.Mixin
*/
var AuthenticationControllerMixin = Ember.Mixin.create({
  /**
    The authenticator class used to authenticate the session.

    @property authenticator
    @type EmberSimpleAuth.Authenticators.Base
    @default null
  */
  authenticator: null,

  actions: {
    /**
      This action will authenticate the session with an instance of the
      configured `authenticator` class.

      If authentication succeeds, this method triggers the
      `sessionAuthenticationSucceeded` action (see
      [EmberSimpleAuth.ApplicationRouteMixin#sessionAuthenticationSucceeded](#EmberSimpleAuth-ApplicationRouteMixin-sessionAuthenticationSucceeded)).
      If authentication fails it triggers the `sessionAuthenticationFailed`
      action (see
      [EmberSimpleAuth.ApplicationRouteMixin#sessionAuthenticationFailed](#EmberSimpleAuth-ApplicationRouteMixin-sessionAuthenticationFailed)).

      @method actions.authenticate
      @param {Object} options Any options the auhtenticator needs to authenticate the session
    */
    authenticate: function(options) {
      var _this = this;
      this.get('session').authenticate(this.get('authenticator'), options);
    }
  }
});

export { AuthenticationControllerMixin };
