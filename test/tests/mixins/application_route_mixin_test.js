import { ApplicationRouteMixin } from 'ember-simple-auth/mixins/application_route_mixin';
import { Configuration } from 'ember-simple-auth/core';
import { Session } from 'ember-simple-auth/session';
import { Ephemeral } from 'ember-simple-auth/stores/ephemeral';

var testRoute;
var TestRoute = Ember.Route.extend(ApplicationRouteMixin, {
  transitionTo: function(targetRoute) {
    this.transitionedTo = targetRoute;
  },
  send: function(action) {
    this.invokedsessionInvalidationSucceeded = (action === 'sessionInvalidationSucceeded');
    this.invokedsessionInvalidationFailed    = (action === 'sessionInvalidationFailed');
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

module('ApplicationRouteMixin', {
  setup: function() {
    testRoute             = TestRoute.create();
    authenticatorMock     = AuthenticatorMock.create();
    containerMock         = ContainerMock.create();
    ContainerMock._lookup = authenticatorMock;
    var session           = Session.create({ store: Ephemeral.create(), container: containerMock });
    testRoute.set('session', session);
  }
});

test('redirects to authenticate the session', function() {
  testRoute._actions.authenticateSession.apply(testRoute);

  equal(testRoute.transitionedTo, Configuration.authenticationRoute, 'ApplicationRouteMixin redirects to the authenticationRoute to authenticate the session.');
});

test('invalidates the current session', function() {
  AuthenticatorMock._resolve = true;
  testRoute.set('session.isAuthenticated', true);
  Ember.run(function() {
    testRoute._actions.invalidateSession.apply(testRoute);
  });

  equal(testRoute.get('session.isAuthenticated'), false, 'ApplicationRouteMixin invalidates the current session when session invalidation is triggered.');
  equal(testRoute.transitionedTo, Configuration.routeAfterInvalidation, 'ApplicationRouteMixin redirects to the routeAfterInvalidation when session invalidation is successful.');
  ok(testRoute.invokedsessionInvalidationSucceeded, 'ApplicationRouteMixin triggers the sessionInvalidationSucceeded action when session invalidation is successful.');

  testRoute.transitionedTo                      = null;
  testRoute.invokedsessionInvalidationSucceeded = false;
  AuthenticatorMock._resolve                    = false;
  Ember.run(function() {
    testRoute._actions.invalidateSession.apply(testRoute);
  });

  ok(!testRoute.invokedsessionInvalidationSucceeded, 'ApplicationRouteMixin does not invoke the sessionInvalidationSucceeded action when session invalidation fails.');
  equal(testRoute.transitionedTo, null, 'ApplicationRouteMixin does not redirect to the routeAfterInvalidation on session invalidation when session invalidation fails.');
  ok(testRoute.invokedsessionInvalidationFailed, 'ApplicationRouteMixin invokes the sessionInvalidationFailed action when session invalidation fails.');
});

test('redirects when session authentication succeeds', function() {
  testRoute._actions.sessionAuthenticationSucceeded.apply(testRoute);

  equal(testRoute.transitionedTo, Configuration.routeAfterAuthentication, 'ApplicationRouteMixin redirects to the routeAfterAuthentication route on sessionAuthenticationSucceeded when no attempted transition is saved.');

  testRoute.set('session.attemptedTransition', attemptedTransitionMock);
  testRoute._actions.sessionAuthenticationSucceeded.apply(testRoute);

  ok(attemptedTransitionMock.retried, 'ApplicationRouteMixin retries a saved attempted transition on sessionAuthenticationSucceeded when one is saved.');
});

test('clears a saved attempted transition when session authentication succeeds', function() {
  testRoute.set('session.attemptedTransition', attemptedTransitionMock);
  testRoute._actions.sessionAuthenticationSucceeded.apply(testRoute);

  equal(testRoute.get('session.attemptedTransition'), null, 'ApplicationRouteMixin clears a saved attempted transition on sessionAuthenticationSucceeded.');
});

test('invalidates the session when an authorization error occurs', function() {
  AuthenticatorMock._resolve = true;
  testRoute.set('session.isAuthenticated', true);
  Ember.run(function() {
    testRoute._actions.error.apply(testRoute, [{ status: 500 }]);
  });

  ok(testRoute.get('session.isAuthenticated'), 'ApplicationRouteMixin does not invalidate the current session when a non-authorization related error occurs.');
  equal(testRoute.transitionedTo, null, 'ApplicationRouteMixin does not transition to the routeAfterInvalidation when a non-authorization related error occurs.');

  Ember.run(function() {
    testRoute._actions.error.apply(testRoute, [{ status: 401 }]);
  });

  equal(testRoute.get('session.isAuthenticated'), false, 'ApplicationRouteMixin invalidates the current session when an authorization error occurs.');
  equal(testRoute.transitionedTo, Configuration.routeAfterInvalidation, 'ApplicationRouteMixin transitions to the routeAfterInvalidation when an authorization error occurs.');
});
