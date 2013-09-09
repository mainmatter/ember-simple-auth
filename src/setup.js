EmberAuthSimple = Ember.Object.extend({
  setup: function(app, options) {
    this.baseUrl = options.baseUrl || '';
    app.Router.map(function() {
      this.route('login');
      this.route('logout');
    });
    var session = EmberAuthSimple.Session.create();
    app.register('auth:session', session, { instantiate: false, singleton: true });
    $.each(['model', 'controller', 'view', 'route'], function(i, component) {
      app.inject(component, 'session', 'auth:session');
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
