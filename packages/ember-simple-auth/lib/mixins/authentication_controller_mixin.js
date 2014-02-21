'use strict';

/**
  The mixin for the controller that handles the `authenticationRoute` specified
  in [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup)). It provides the
  `authenticate` action that will authenticate the session with the configured
  authenticator when invoked.

  @class AuthenticationControllerMixin
  @namespace Ember.SimpleAuth
  @extends Ember.Mixin
*/
Ember.SimpleAuth.AuthenticationControllerMixin = Ember.Mixin.create({
  /**
    The authenticator class used to authenticate the session.

    @property authenticator
    @type Ember.SimpleAuth.Authenticators.Base
    @default null
  */
  authenticator: null,

  actions: {
    /**
      This action will authenticate the session with an instance of the
      configured `authenticator` class.

      If authentication succeeds, this method triggers the
      `sessionAuthenticationSucceeded` action (see
      [Ember.SimpleAuth.ApplicationRouteMixin#sessionAuthenticationSucceeded](#Ember-SimpleAuth-ApplicationRouteMixin-sessionAuthenticationSucceeded)).
      If authentication fails it triggers the `sessionAuthenticationFailed`
      action (see
      [Ember.SimpleAuth.ApplicationRouteMixin#sessionAuthenticationFailed](#Ember-SimpleAuth-ApplicationRouteMixin-sessionAuthenticationFailed)).

      @method actions.authenticate
      @param {Object} options Any options the auhtenticator needs to authenticate the session
    */
    authenticate: function(options) {
      var _this = this;
      this.get('session').authenticate(this.get('authenticator'), options).then(function() {
        _this.send('sessionAuthenticationSucceeded');
      }, function(error) {
        _this.send('sessionAuthenticationFailed', error);
      });
    }
  }
});
