var testRoute;
var TestRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
  transitionTo: function(targetRoute) {
    this.transitionedTo = targetRoute;
  },
  send: function(action) {
    this.invokedSessionAuthenticationSucceeded = (action === 'sessionAuthenticationSucceeded');
    this.invokedSessionAuthenticationFailed    = (action === 'sessionAuthenticationFailed');
    this.invokedSessionInvalidationSucceeded   = (action === 'sessionInvalidationSucceeded');
    this.invokedSessionInvalidationFailed      = (action === 'sessionInvalidationFailed');
    this._actions[action].apply(this);
  }
});

var containerMock;
var ContainerMock = Ember.Object.extend({
  lookup: function(name) {
    return ContainerMock._lookup;
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
    testRoute             = TestRoute.create();
    authenticatorMock     = AuthenticatorMock.create();
    containerMock         = ContainerMock.create();
    ContainerMock._lookup = authenticatorMock;
    var session           = Ember.SimpleAuth.Session.create({ store: Ember.SimpleAuth.Stores.Ephemeral.create(), container: containerMock });
    testRoute.set('session', session);
  }
});

test('redirects to authenticate the session', function() {
  testRoute._actions['authenticateSession'].apply(testRoute);

  equal(testRoute.transitionedTo, Ember.SimpleAuth.authenticationRoute, 'Ember.SimpleAuth.ApplicationRouteMixin redirects to the authenticationRoute to authenticate the session.');
});

test('listens to session events', function() {
  Ember.run(function() {
    testRoute.activate();
    testRoute.get('session').trigger('ember-simple-auth:session-authentication-succeeded');
  });

  ok(testRoute.invokedSessionAuthenticationSucceeded, 'Ember.SimpleAuth.ApplicationRouteMixin triggers the sessionAuthenticationSucceeded action when the session triggers the "ember-simple-auth:session-authentication-succeeded" event.');

  Ember.run(function() {
    testRoute.get('session').trigger('ember-simple-auth:session-authentication-failed');
  });

  ok(testRoute.invokedSessionAuthenticationFailed, 'Ember.SimpleAuth.ApplicationRouteMixin triggers the sessionAuthenticationFailed action when the session triggers the "ember-simple-auth:session-authentication-failed" event.');

  Ember.run(function() {
    testRoute.get('session').trigger('ember-simple-auth:session-invalidation-succeeded');
  });

  ok(testRoute.invokedSessionInvalidationSucceeded, 'Ember.SimpleAuth.ApplicationRouteMixin triggers the sessionInvalidationSucceeded action when the session triggers the "ember-simple-auth:session-invalidation-succeeded" event.');

  Ember.run(function() {
    testRoute.get('session').trigger('ember-simple-auth:session-invalidation-failed');
  });

  ok(testRoute.invokedSessionInvalidationFailed, 'Ember.SimpleAuth.ApplicationRouteMixin triggers the sessionInvalidationFailed action when the session triggers the "ember-simple-auth:session-invalidation-failed" event.');
});

test('invalidates the current session', function() {
  AuthenticatorMock._resolve = true;
  testRoute.set('session.isAuthenticated', true);
  Ember.run(function() {
    testRoute._actions['invalidateSession'].apply(testRoute);
  });

  equal(testRoute.get('session.isAuthenticated'), false, 'Ember.SimpleAuth.ApplicationRouteMixin invalidates the current session when session invalidation is triggered.');
  equal(testRoute.transitionedTo, Ember.SimpleAuth.routeAfterInvalidation, 'Ember.SimpleAuth.ApplicationRouteMixin redirects to the routeAfterInvalidation when session invalidation is successful.');
  ok(testRoute.invokedSessionInvalidationSucceeded, 'Ember.SimpleAuth.ApplicationRouteMixin triggers the sessionInvalidationSucceeded action when session invalidation is successful.');

  testRoute.transitionedTo                      = null;
  testRoute.invokedsessionInvalidationSucceeded = false;
  AuthenticatorMock._resolve                    = false;
  Ember.run(function() {
    testRoute._actions['invalidateSession'].apply(testRoute);
  });

  ok(!testRoute.invokedSessionInvalidationSucceeded, 'Ember.SimpleAuth.ApplicationRouteMixin does not invoke the sessionInvalidationSucceeded action when session invalidation fails.');
  equal(testRoute.transitionedTo, null, 'Ember.SimpleAuth.ApplicationRouteMixin does not redirect to the routeAfterInvalidation on session invalidation when session invalidation fails.');
  ok(testRoute.invokedSessionInvalidationFailed, 'Ember.SimpleAuth.ApplicationRouteMixin invokes the sessionInvalidationFailed action when session invalidation fails.');
});

test('redirects when session authentication succeeds', function() {
  testRoute._actions['sessionAuthenticationSucceeded'].apply(testRoute);

  equal(testRoute.transitionedTo, Ember.SimpleAuth.routeAfterAuthentication, 'Ember.SimpleAuth.ApplicationRouteMixin redirects to the routeAfterAuthentication route on sessionAuthenticationSucceeded when no attempted transition is saved.');

  testRoute.set('session.attemptedTransition', attemptedTransitionMock);
  testRoute._actions['sessionAuthenticationSucceeded'].apply(testRoute);

  ok(attemptedTransitionMock.retried, 'Ember.SimpleAuth.ApplicationRouteMixin retries a saved attempted transition on sessionAuthenticationSucceeded when one is saved.');
});

test('clears a saved attempted transition when session authentication succeeds', function() {
  testRoute.set('session.attemptedTransition', attemptedTransitionMock);
  testRoute._actions['sessionAuthenticationSucceeded'].apply(testRoute);

  equal(testRoute.get('session.attemptedTransition'), null, 'Ember.SimpleAuth.ApplicationRouteMixin clears a saved attempted transition on sessionAuthenticationSucceeded.');
});

test('invalidates the session when an authorization error occurs', function() {
  AuthenticatorMock._resolve = true;
  testRoute.set('session.isAuthenticated', true);
  Ember.run(function() {
    testRoute._actions['error'].apply(testRoute, [{ status: 500 }]);
  });

  ok(testRoute.get('session.isAuthenticated'), 'Ember.SimpleAuth.ApplicationRouteMixin does not invalidate the current session when a non-authorization related error occurs.');
  equal(testRoute.transitionedTo, null, 'Ember.SimpleAuth.ApplicationRouteMixin does not transition to the routeAfterInvalidation when a non-authorization related error occurs.');

  Ember.run(function() {
    testRoute._actions['error'].apply(testRoute, [{ status: 401 }]);
  });

  equal(testRoute.get('session.isAuthenticated'), false, 'Ember.SimpleAuth.ApplicationRouteMixin invalidates the current session when an authorization error occurs.');
  equal(testRoute.transitionedTo, Ember.SimpleAuth.routeAfterInvalidation, 'Ember.SimpleAuth.ApplicationRouteMixin transitions to the routeAfterInvalidation when an authorization error occurs.');
});
