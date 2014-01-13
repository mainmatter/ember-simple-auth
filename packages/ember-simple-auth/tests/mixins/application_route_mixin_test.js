var testRoute;
var TestRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
  transitionTo: function(targetRoute) {
    this.transitionedTo = targetRoute;
  },
  send: function(action) {
    this.invokedsessionInvalidationSucceeded = (action === 'sessionInvalidationSucceeded');
    this.invokedsessionInvalidationFailed    = (action === 'sessionInvalidationFailed');
    this._actions[action].apply(this);
  }
});

var authenticatorMock;
var AuthenticatorMock = Ember.Object.extend(Ember.Evented, {
  invalidate: function() {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (AuthenticatorMock._resolve) {
        resolve();
      } else {
        reject();
      }
    });
  }
});

var attemptedTransitionMock = { retry: function() { this.retried = true; } };

module('Ember.SimpleAuth.ApplicationRouteMixin', {
  setup: function() {
    testRoute         = TestRoute.create();
    authenticatorMock = AuthenticatorMock.create();
    var session       = Ember.SimpleAuth.Session.create({ store: Ember.SimpleAuth.Stores.Ephemeral.create(), authenticator: authenticatorMock });
    testRoute.set('session', session);
  }
});

test('redirects to the correct route to authenticate the session', function() {
  testRoute._actions['authenticateSession'].apply(testRoute);

  equal(testRoute.transitionedTo, Ember.SimpleAuth.authenticationRoute, 'Ember.SimpleAuth.ApplicationRouteMixin redirects to the authentication route to authenticate the session.');
});

test('invalidates the current session when session invalidation is triggered', function() {
  AuthenticatorMock._resolve = true;
  testRoute.set('session.isAuthenticated', true);
  Ember.run(function() {
    testRoute._actions['invalidateSession'].apply(testRoute);
  });

  equal(testRoute.get('session.isAuthenticated'), false, 'Ember.SimpleAuth.ApplicationRouteMixin invalidates the current session when session invalidation is triggered.');
});

test('redirects to the correct route when session invalidation is triggered', function() {
  AuthenticatorMock._resolve = true;
  Ember.run(function() {
    testRoute._actions['invalidateSession'].apply(testRoute);
  });

  equal(testRoute.transitionedTo, Ember.SimpleAuth.routeAfterInvalidation, 'Ember.SimpleAuth.ApplicationRouteMixin redirects to the routeAfterInvalidation when session invalidation is triggered.');
  ok(testRoute.invokedsessionInvalidationSucceeded, 'Ember.SimpleAuth.ApplicationRouteMixin triggers the sessionInvalidationSucceeded action when session invalidation is successful.');

  testRoute.transitionedTo         = null;
  testRoute.invokedsessionInvalidationSucceeded = false;
  AuthenticatorMock._resolve       = false;
  Ember.run(function() {
    testRoute._actions['invalidateSession'].apply(testRoute);
  });

  ok(!testRoute.invokedsessionInvalidationSucceeded, 'Ember.SimpleAuth.ApplicationRouteMixin does not invoke the sessionInvalidationSucceeded action when session invalidation fails.');
  equal(testRoute.transitionedTo, null, 'Ember.SimpleAuth.ApplicationRouteMixin does not redirect to the routeAfterInvalidation on session invalidation when session invalidation fails.');
  ok(testRoute.invokedsessionInvalidationFailed, 'Ember.SimpleAuth.ApplicationRouteMixin invokes the sessionInvalidationFailed action when session invalidation fails.');
});

test('redirects to the correct route on sessionAuthenticationSucceeded', function() {
  testRoute._actions['sessionAuthenticationSucceeded'].apply(testRoute);

  equal(testRoute.transitionedTo, Ember.SimpleAuth.routeAfterAuthentication, 'Ember.SimpleAuth.ApplicationRouteMixin redirects to the routeAfterAuthentication route on sessionAuthenticationSucceeded when no attempted transition is saved.');

  testRoute.set('session.attemptedTransition', attemptedTransitionMock);
  testRoute._actions['sessionAuthenticationSucceeded'].apply(testRoute);

  ok(attemptedTransitionMock.retried, 'Ember.SimpleAuth.ApplicationRouteMixin retries a saved attempted transition on sessionAuthenticationSucceeded.');
});

test('clears a saved attempted transition on sessionAuthenticationSucceeded', function() {
  testRoute.set('session.attemptedTransition', attemptedTransitionMock);
  testRoute._actions['sessionAuthenticationSucceeded'].apply(testRoute);

  equal(testRoute.get('session.attemptedTransition'), null, 'Ember.SimpleAuth.ApplicationRouteMixin clears a saved attempted transition on sessionAuthenticationSucceeded.');
});
