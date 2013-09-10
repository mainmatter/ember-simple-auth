/**
  Simple Auth

  @module simple-auth
  @requires ember-runtime
*/

SimpleAuth = Ember.Object.extend({
  setup: function(app, options) {
    this.baseUrl = options.baseUrl || '';
    var session = SimpleAuth.Session.create();
    app.register('simple_auth:session', session, { instantiate: false, singleton: true });
    $.each(['model', 'controller', 'view', 'route'], function(i, component) {
      app.inject(component, 'session', 'simple_auth:session');
    });
    if (options.authenticateAjax) {
      Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
        if (!jqXHR.crossDomain) {
          jqXHR.setRequestHeader('X-AUTHENTICATION-TOKEN', session.get('authToken'));
        }
      });
    }
  }
});

require('ember-simple-auth/session');
require('ember-simple-auth/login_controller');
require('ember-simple-auth/logout_route');
