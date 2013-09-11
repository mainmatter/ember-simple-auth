var testRoute = Ember.Object.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
  route: null,

  transitionTo: function(targetRoute) {
    this.route = targetRoute;
  }
}).create();

module('Ember.SimpleAuth.AuthenticatedRouteMixin', {
  setup: function() {
    testRoute.route = null;
    testRoute.set('session', Ember.SimpleAuth.Session.create());
  }
});

test('it redirect to the login route correctly', function() {
  var attemptedTransition = Ember.Object.create();
  testRoute.redirectToLogin(attemptedTransition);

  equal(testRoute.route, 'login', 'Ember.SimpleAuth.AuthenticatedRouteMixin redirects to the login route correctly.');
  equal(testRoute.get('session.attemptedTransition'), attemptedTransition, 'Ember.SimpleAuth.AuthenticatedRouteMixin saves the attempted transition in the session when redirecting to the login route.');
});

test('it redirects to the login route before model when the session is not authenticated', function() {
  testRoute.set('session.authToken', '');
  testRoute.beforeModel();

  equal(testRoute.route, 'login', 'Ember.SimpleAuth.AuthenticatedRouteMixin redirects to the login route before model when the session is not authenticated.');

  testRoute.route = null;
  testRoute.set('session.authToken', 'token');
  testRoute.beforeModel();

  notEqual(testRoute.route, 'login', 'Ember.SimpleAuth.AuthenticatedRouteMixin does not redirect to the login route before model when the session is authenticated.');
});
