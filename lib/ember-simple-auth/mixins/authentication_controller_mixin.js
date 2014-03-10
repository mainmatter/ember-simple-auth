var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

/**
  The mixin for the controller that handles the `authenticationRoute` specified
  in [Ember.SimpleAuth.setup](#Ember.SimpleAuth-setup)). It provides the
  `authenticate` action that will authenticate the session with the configured
  [Ember.SimpleAuth.AuthenticationControllerMixin#authenticatorFactory](#Ember.SimpleAuth-AuthenticationControllerMixin-authenticatorFactory)
  when invoked.

  @class AuthenticationControllerMixin
  @extends Ember.Mixin
*/
var AuthenticationControllerMixin = Ember.Mixin.create({
  /**
    The authenticator factory used to authenticate the session.

    @property authenticatorFactory
    @type String
    @default null
  */
  authenticatorFactory: null,

  actions: {
    /**
      This action will authenticate the session with the configured
      [Ember.SimpleAuth.AuthenticationControllerMixin#authenticatorFactory](#Ember.SimpleAuth-AuthenticationControllerMixin-authenticatorFactory)
      (see
      Ember.SimpleAuth.Session#authenticate](#Ember.SimpleAuth-Session-authenticate)).

      If authentication succeeds, this method triggers the
      `sessionAuthenticationSucceeded` action (see
      [Ember.SimpleAuth.ApplicationRouteMixin#sessionAuthenticationSucceeded](#Ember.SimpleAuth-ApplicationRouteMixin-sessionAuthenticationSucceeded)).
      If authentication fails it triggers the `sessionAuthenticationFailed`
      action (see
      [Ember.SimpleAuth.ApplicationRouteMixin#sessionAuthenticationFailed](#Ember.SimpleAuth-ApplicationRouteMixin-sessionAuthenticationFailed)).

      @method actions.authenticate
      @param {Object} options Any options the auhtenticator needs to authenticate the session
    */
    authenticate: function(options) {
      var _this = this;
      this.get('session').authenticate(this.get('authenticatorFactory'), options);
    }
  }
});

export { AuthenticationControllerMixin };
