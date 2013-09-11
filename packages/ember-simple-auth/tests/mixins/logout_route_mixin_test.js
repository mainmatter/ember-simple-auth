var testRoute = Ember.Object.extend(Ember.SimpleAuth.LogoutRouteMixin, {
  session: Ember.SimpleAuth.Session.create(),
  route:   null,

  transitionToRoute: function(targetRoute) {
    this.route = targetRoute;
  }
}).create();

var ajaxRequestOptions;
var ajaxMock = function(options) {
  ajaxRequestOptions = options;
  return {
    always: function(callback) {
      callback();
    }
  };
};

module('Ember.SimpleAuth.LogoutRouteMixin', {
  originalAjax: Ember.$.ajax,
  setup: function() {
    Ember.SimpleAuth.serverSessionRoute = '/session/route';
    Ember.$.ajax = ajaxMock;
  },
  teardown: function() {
    Ember.$.ajax = this.originalAjax;
  }
});

test('sends a DELETE request to the correct route before model', function() {
  testRoute.beforeModel();

  equal(ajaxRequestOptions.url, '/session/route', 'Ember.SimpleAuth.LogoutRouteMixin sends a request to the correct route before model.');
  equal(ajaxRequestOptions.type, 'DELETE', 'Ember.SimpleAuth.LogoutRouteMixin sends a DELETE request before model.');
});

test('destroys the current session before model', function() {
  testRoute.set('session.authToken', 'some token');
  testRoute.beforeModel();

  equal(testRoute.get('session.isAuthenticated'), false, 'Ember.SimpleAuth.LogoutRouteMixin destroy the current session before model.');
});

test('redirects to the correct route before model', function() {
  Ember.SimpleAuth.routeAfterLogout = 'some.route';
  testRoute.beforeModel();

  equal(testRoute.route, 'some.route', 'Ember.SimpleAuth.LogoutRouteMixin redirects to the correct route before model.');
});
