EmberAuthSimple = Ember.Object.extend({
  setup: function(app, options) {
    this.baseUrl = options.baseUrl || '';
    app.Router.map(function() {
      this.route('login');
      this.route('logout');
    });
    app.register('session', EmberAuthSimple.Session);
    $.each(['model', 'store', 'controller', 'route'], function(target) {
      app.inject(target, 'session', 'session');
    });
  }
});
