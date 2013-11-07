var testRoute;
var TestRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
  transitionTo: function(targetRoute) {
    this.transitionedTo = targetRoute;
  }
});

var attemptedTransitionMock = { retry: function() { this.retried = true; } };

module('Ember.SimpleAuth.ApplicationRouteMixin', {
  setup: function() {
    testRoute                            = TestRoute.create();
    Ember.SimpleAuth.serverTokenEndpoint = '/token';
    var session                          = Ember.SimpleAuth.Session.create();
    session.destroy();
    testRoute.set('session', session);
  }
});

test('redirects to the correct route on login', function() {
  Ember.SimpleAuth.loginRoute = 'some.route';
  testRoute._actions['login'].apply(testRoute);

  equal(testRoute.transitionedTo, 'some.route', 'Ember.SimpleAuth.ApplicationRouteMixin redirects to the login route on login.');
});

test('destroys the current session on logout', function() {
  testRoute.set('session.authToken', 'some token');
  testRoute._actions['logout'].apply(testRoute);

  equal(testRoute.get('session.isAuthenticated'), false, 'Ember.SimpleAuth.ApplicationRouteMixin destroys the current session on logout.');
});

test('redirects to the correct route on logout', function() {
  Ember.SimpleAuth.routeAfterLogout = 'some.route';
  testRoute._actions['logout'].apply(testRoute);

  equal(testRoute.transitionedTo, 'some.route', 'Ember.SimpleAuth.ApplicationRouteMixin redirects to the routeAfterLogout on logout.');
});

test('redirects to the correct route on loginSucceeded', function() {
  Ember.SimpleAuth.routeAfterLogin = 'some.route';
  testRoute._actions['loginSucceeded'].apply(testRoute);

  equal(testRoute.transitionedTo, 'some.route', 'Ember.SimpleAuth.ApplicationRouteMixin redirects to the routeAfterLogin route on loginSucceeded when no attempted transition is saved.');

  testRoute.set('session.attemptedTransition', attemptedTransitionMock);
  testRoute._actions['loginSucceeded'].apply(testRoute);

  ok(attemptedTransitionMock.retried, 'Ember.SimpleAuth.ApplicationRouteMixin retries a saved attempted transition on loginSucceeded.');
});

test('clears a saved attempted transition on loginSucceeded', function() {
  testRoute.set('session.attemptedTransition', attemptedTransitionMock);
  testRoute._actions['loginSucceeded'].apply(testRoute);

  equal(testRoute.get('session.attemptedTransition'), undefined, 'Ember.SimpleAuth.ApplicationRouteMixin clears a saved attempted transition on loginSucceeded.');
});
