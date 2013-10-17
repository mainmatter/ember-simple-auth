var testRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
  session:        Ember.SimpleAuth.Session.create(),
  transitionedTo: null,

  transitionTo: function(targetRoute) {
    this.transitionedTo = targetRoute;
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

module('Ember.SimpleAuth.ApplicationRouteMixin', {
  originalAjax: Ember.$.ajax,
  setup: function() {
    Ember.SimpleAuth.serverSessionRoute = '/session/route';
    Ember.$.ajax                        = ajaxMock;
    ajaxRequestUrl                      = undefined;
    ajaxRequestOptions                  = undefined;
  },
  teardown: function() {
    Ember.$.ajax = this.originalAjax;
  }
});

test('redirects to the login route on login', function() {
  testRoute._actions['login'].apply(testRoute);

  equal(testRoute.transitionedTo, 'login', 'Ember.SimpleAuth.ApplicationRouteMixin redirects to the login route on login.');
});

test('sends a DELETE request to the correct route on logout', function() {
  testRoute._actions['logout'].apply(testRoute);

  equal(ajaxRequestUrl, '/session/route', 'Ember.SimpleAuth.ApplicationRouteMixin sends a request to the correct route on logout.');
  equal(ajaxRequestOptions.type, 'DELETE', 'Ember.SimpleAuth.ApplicationRouteMixin a DELETE request on logout.');
});

test('destroys the current session on logout', function() {
  testRoute.set('session.authToken', 'some token');
  testRoute._actions['logout'].apply(testRoute);

  equal(testRoute.get('session.isAuthenticated'), false, 'Ember.SimpleAuth.ApplicationRouteMixin destroy the current session on logout.');
});

test('redirects to the correct route on logout', function() {
  Ember.SimpleAuth.routeAfterLogout = 'some.route';
  testRoute._actions['logout'].apply(testRoute);

  equal(testRoute.transitionedTo, 'some.route', 'Ember.SimpleAuth.ApplicationRouteMixin redirects to the correct route on logout.');
});
