var testRoute;
var TestRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
  transitionTo: function(targetRoute) {
    this.transitionedTo = targetRoute;
  },
  send: function(action) {
    this.invokedLogoutSucceeded = this.invokedLogoutSucceeded || (action === 'logoutSucceeded');
    this.invokedLogoutFailed    = this.invokedLogoutFailed || (action === 'logoutFailed');
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

test('redirects to the correct route on login', function() {
  testRoute._actions['login'].apply(testRoute);

  equal(testRoute.transitionedTo, Ember.SimpleAuth.loginRoute, 'Ember.SimpleAuth.ApplicationRouteMixin redirects to the login route on login.');
});

test('invalidates the current session on logout', function() {
  AuthenticatorMock._resolve = true;
  testRoute.set('session.isAuthenticated', true);
  Ember.run(function() {
    testRoute._actions['logout'].apply(testRoute);
  });

  equal(testRoute.get('session.isAuthenticated'), false, 'Ember.SimpleAuth.ApplicationRouteMixin invalidates the current session on logout.');
});

test('redirects to the correct route on logout', function() {
  AuthenticatorMock._resolve = true;
  Ember.run(function() {
    testRoute._actions['logout'].apply(testRoute);
  });

  equal(testRoute.transitionedTo, Ember.SimpleAuth.routeAfterLogout, 'Ember.SimpleAuth.ApplicationRouteMixin redirects to the routeAfterLogout on logout.');
  ok(testRoute.invokedLogoutSucceeded, 'Ember.SimpleAuth.ApplicationRouteMixin invokes the logoutSucceeded action when logout is successful.');

  delete testRoute.transitionedTo;
  testRoute.invokedLogoutSucceeded = false;
  AuthenticatorMock._resolve       = false;
  Ember.run(function() {
    testRoute._actions['logout'].apply(testRoute);
  });

  notEqual(testRoute.transitionedTo, Ember.SimpleAuth.routeAfterLogout, 'Ember.SimpleAuth.ApplicationRouteMixin does not redirect to the routeAfterLogout on logout when session invalidation fails.');
  ok(!testRoute.invokedLogoutSucceeded, 'Ember.SimpleAuth.ApplicationRouteMixin does not invoke the logoutSucceeded action when logout fails.');
  ok(testRoute.invokedLogoutFailed, 'Ember.SimpleAuth.ApplicationRouteMixin invokes the logoutFailed action when logout fails.');
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
