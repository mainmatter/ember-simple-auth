var testRoute;
var TestRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
  transitionTo: function(targetRoute) {
    this.transitionedTo = targetRoute;
  }
});

var authenticatorMock;
var AuthenticatorMock = Ember.Object.extend(Ember.Evented, {
  unauthenticate: function() {
    return new Ember.RSVP.Promise(function(resolve, reject) { resolve(); });
  }
});

var attemptedTransitionMock = { retry: function() { this.retried = true; } };

module('Ember.SimpleAuth.ApplicationRouteMixin', {
  setup: function() {
    testRoute                            = TestRoute.create();
    authenticatorMock                    = AuthenticatorMock.create();
    Ember.SimpleAuth.serverTokenEndpoint = '/token';
    var session                          = Ember.SimpleAuth.Session.create({ store: Ember.SimpleAuth.Stores.Ephemeral.create(), authenticator: authenticatorMock });
    testRoute.set('session', session);
  }
});

test('redirects to the correct route on login', function() {
  testRoute._actions['login'].apply(testRoute);

  equal(testRoute.transitionedTo, Ember.SimpleAuth.loginRoute, 'Ember.SimpleAuth.ApplicationRouteMixin redirects to the login route on login.');
});

test('unauthenticates the current session on logout', function() {
  testRoute.set('session.isAuthenticated', true);
  Ember.run(function() {
    testRoute._actions['logout'].apply(testRoute);
  });

  equal(testRoute.get('session.isAuthenticated'), false, 'Ember.SimpleAuth.ApplicationRouteMixin unauthenticates the current session on logout.');
});

test('redirects to the correct route on logout', function() {
  Ember.run(function() {
    testRoute._actions['logout'].apply(testRoute);
  });

  equal(testRoute.transitionedTo, Ember.SimpleAuth.routeAfterLogout, 'Ember.SimpleAuth.ApplicationRouteMixin redirects to the routeAfterLogout on logout.');
});

test('redirects to the correct route on loginSucceeded', function() {
  testRoute._actions['loginSucceeded'].apply(testRoute);

  equal(testRoute.transitionedTo, Ember.SimpleAuth.routeAfterLogin, 'Ember.SimpleAuth.ApplicationRouteMixin redirects to the routeAfterLogin route on loginSucceeded when no attempted transition is saved.');

  testRoute.set('session.attemptedTransition', attemptedTransitionMock);
  testRoute._actions['loginSucceeded'].apply(testRoute);

  ok(attemptedTransitionMock.retried, 'Ember.SimpleAuth.ApplicationRouteMixin retries a saved attempted transition on loginSucceeded.');
});

test('clears a saved attempted transition on loginSucceeded', function() {
  testRoute.set('session.attemptedTransition', attemptedTransitionMock);
  testRoute._actions['loginSucceeded'].apply(testRoute);

  equal(testRoute.get('session.attemptedTransition'), null, 'Ember.SimpleAuth.ApplicationRouteMixin clears a saved attempted transition on loginSucceeded.');
});
