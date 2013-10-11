var testRoute = Ember.Object.extend(Ember.SimpleAuth.LogoutRouteMixin, {
  session: Ember.SimpleAuth.Session.create(),
  route:   null,

  transitionTo: function(targetRoute) {
    this.route = targetRoute;
  }
}).create();

var ajaxRequestUrl;
var ajaxRequestOptions;
var ajaxMock = function(url, options) {
  ajaxRequestUrl     = url;
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
    ajaxRequestUrl     = undefined;
    ajaxRequestOptions = undefined;
    Ember.$.ajax       = ajaxMock;
  },
  teardown: function() {
    Ember.$.ajax = this.originalAjax;
  }
});

test('sends a DELETE request to the correct route before model', function() {
  testRoute.beforeModel();

  equal(ajaxRequestUrl, '/session/route', 'Ember.SimpleAuth.LogoutRouteMixin sends a request to the correct route before model.');
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
