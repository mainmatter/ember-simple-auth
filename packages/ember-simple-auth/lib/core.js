/**
  The main namespace for Ember.SimpleAuth

  @class SimpleAuth
  @namespace Ember
  @static
**/
Ember.SimpleAuth = {};

/**
  Sets up Ember.SimpleAuth for your application; invoke this in a custom initializer.

  @method setup
  @static
  @param {Container} container The Ember.js container, see http://git.io/ed4U7Q
  @param {Ember.Application} application The Ember.js application instance
  @param {Object} [options]
    @param {String} [options.routeAfterLogin] route to redirect the user to after successfully logging in - defaults to 'index'
    @param {String} [options.routeAfterLogout] route to redirect the user to after logging out - defaults to 'index'
    @param {String} [options.loginRoute] route to redirect the user to when login is required - defaults to 'login'
    @param {String} [options.serverTokenRoute] the server endpoint used to obtain the access token - defaults to '/token'
    @param {String} [options.autoRefreshToken] enable/disable automatic token refreshing (if the server supports it) - defaults to true

  @example
    Ember.Application.initializer({
      name: 'authentication',
      initialize: function(container, application) {
        Ember.SimpleAuth.setup(container, application);
      }
    });
**/
Ember.SimpleAuth.setup = function(container, application, options) {
  options = options || {};
  this.routeAfterLogin     = options.routeAfterLogin || 'index';
  this.routeAfterLogout    = options.routeAfterLogout || 'index';
  this.loginRoute          = options.loginRoute || 'login';
  this.serverTokenEndpoint = options.serverTokenEndpoint || '/token';
  this.autoRefreshToken    = Ember.isEmpty(options.autoRefreshToken) ? true : !!options.autoRefreshToken;

  var session = Ember.SimpleAuth.Session.create();
  application.register('simple_auth:session', session, { instantiate: false, singleton: true });
  Ember.$.each(['model', 'controller', 'view', 'route'], function(i, component) {
    application.inject(component, 'session', 'simple_auth:session');
  });

  Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    if (!jqXHR.crossDomain && !Ember.isEmpty(session.get('authToken'))) {
      jqXHR.setRequestHeader('Authorization', 'Bearer ' + session.get('authToken'));
    }
  });

  this.externalLoginSucceeded = function(sessionData) {
    session.setup(sessionData);
    container.lookup('route:application').send('loginSucceeded');
  };
  this.externalLoginFailed = function(error) {
    container.lookup('route:application').send('loginFailed', error);
  };
};
