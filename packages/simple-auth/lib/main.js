require('simple-auth/session');
require('simple-auth/login_controller');
require('simple-auth/logout_route');

SimpleAuth = Ember.Object.extend({
  setup: function(app, options) {
    this.baseUrl = options.baseUrl || '';
    var session = SimpleAuth.Session.create();
    app.register('simple_auth:session', session, { instantiate: false, singleton: true });
    $.each(['model', 'controller', 'view', 'route'], function(i, component) {
      app.inject(component, 'session', 'simple_auth:session');
    });
    if (options.authenticateAjax)
      Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
        if (!jqXHR.crossDomain) {
          jqXHR.setRequestHeader('X-AUTHENTICATION-TOKEN', session.get('authToken'));
        }
      });
    }
  }
});
