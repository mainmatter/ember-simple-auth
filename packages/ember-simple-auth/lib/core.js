Ember.SimpleAuth = {};
Ember.SimpleAuth.setup = function(app, options) {
  options = options || {};
  this.pathPrefix = options.pathPrefix || '';
  this.routeAfterLogin = options.routeAfterLogin || 'index';
  this.routeAfterLogout = options.routeAfterLogout || 'index';

  var session = Ember.SimpleAuth.Session.create();
  app.register('simple_auth:session', session, { instantiate: false, singleton: true });
  Ember.$.each(['model', 'controller', 'view', 'route'], function(i, component) {
    app.inject(component, 'session', 'simple_auth:session');
  });

  if (options.authenticateAjax) {
    Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
      if (!jqXHR.crossDomain) {
        jqXHR.setRequestHeader('X-AUTHENTICATION-TOKEN', session.get('authToken'));
      }
    });
  }
};
