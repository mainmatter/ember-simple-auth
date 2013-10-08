Ember.SimpleAuth = {};
Ember.SimpleAuth.setup = function(app, options) {
  options = options || {};
  this.routeAfterLogin = options.routeAfterLogin || 'index';
  this.routeAfterLogout = options.routeAfterLogout || 'index';
  this.loginRoute = options.loginRoute || 'login';
  this.logoutRoute = options.logoutRoute || 'logout';
  this.serverSessionRoute = options.serverSessionRoute || '/session';

  var session = Ember.SimpleAuth.Session.create();
  app.register('simple_auth:session', session, { instantiate: false, singleton: true });
  Ember.$.each(['model', 'controller', 'view', 'route'], function(i, component) {
    app.inject(component, 'session', 'simple_auth:session');
  });

  Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    if (!jqXHR.crossDomain && !Ember.isEmpty(session.get('authToken'))) {
      jqXHR.setRequestHeader('X-AUTHENTICATION-TOKEN',  session.get('authToken'));
    }
  });
};
