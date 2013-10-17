var testRoute = Ember.Route.extend(Ember.SimpleAuth.LogoutActionableMixin, {
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

module('Ember.SimpleAuth.LogoutActionableMixin', {
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

test('sends a DELETE request to the correct route on logout', function() {
  testRoute._actions['logout'].apply(testRoute);

  equal(ajaxRequestUrl, '/session/route', 'Ember.SimpleAuth.LogoutRouteMixin sends a request to the correct route before model.');
  equal(ajaxRequestOptions.type, 'DELETE', 'Ember.SimpleAuth.LogoutRouteMixin sends a DELETE request before model.');
});

test('destroys the current session on logout', function() {
  testRoute.set('session.authToken', 'some token');
  testRoute._actions['logout'].apply(testRoute);

  equal(testRoute.get('session.isAuthenticated'), false, 'Ember.SimpleAuth.LogoutRouteMixin destroy the current session before model.');
});

test('redirects to the correct route on logout', function() {
  Ember.SimpleAuth.routeAfterLogout = 'some.route';
  testRoute._actions['logout'].apply(testRoute);

  equal(testRoute.route, 'some.route', 'Ember.SimpleAuth.LogoutRouteMixin redirects to the correct route before model.');
});
