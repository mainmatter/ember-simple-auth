var testRoute;
var TestRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin);

var attemptedTransitionMock;
var AttemptedTransitionMock = Ember.Object.extend({
  abort: function() {
    this.aborted = true;
  },
  send: function(name) {
    this.invokedAuthenticateSession = (name === 'authenticateSession');
  }
});

module('Ember.SimpleAuth.AuthenticatedRouteMixin', {
  setup: function() {
    testRoute               = TestRoute.create();
    attemptedTransitionMock = AttemptedTransitionMock.create();
    var session             = Ember.SimpleAuth.Session.create({ store: Ember.SimpleAuth.Stores.Ephemeral.create() });
    testRoute.set('session', session);
  }
});

test('triggers authentication correctly', function() {
  testRoute.triggerSessionAuthentication(attemptedTransitionMock);

  equal(testRoute.get('session.attemptedTransition'), attemptedTransitionMock, 'Ember.SimpleAuth.AuthenticatedRouteMixin saves the attempted transition in the session when session authentication is triggered.');
  ok(attemptedTransitionMock.invokedAuthenticateSession, 'Ember.SimpleAuth.AuthenticatedRouteMixin invokes the authenticateSession action on the attempted transition when session authentication is triggered.');
});

test('triggers authentication in beforeModel when the session is not authenticated', function() {
  testRoute.set('session.isAuthenticated', false);
  testRoute.beforeModel(attemptedTransitionMock);

  ok(attemptedTransitionMock.invokedAuthenticateSession, 'Ember.SimpleAuth.AuthenticatedRouteMixin triggers authenticateSession in beforeModel when the session is not authenticated.');

  testRoute.set('session.isAuthenticated', true);
  attemptedTransitionMock.invokedAuthenticateSession = false;
  testRoute.beforeModel(attemptedTransitionMock);

  ok(!attemptedTransitionMock.invokedAuthenticateSession, 'Ember.SimpleAuth.AuthenticatedRouteMixin does not trigger authenticateSession in beforeModel when the session is authenticated.');
});

test('aborts the attempted transaction in beforeModel when the session is not authenticated', function() {
  testRoute.set('session.isAuthenticated', false);
  testRoute.beforeModel(attemptedTransitionMock);

  ok(attemptedTransitionMock.aborted, 'Ember.SimpleAuth.AuthenticatedRouteMixin aborts the attempted transition in beforeModel when the session is not authenticated.');

  testRoute.set('session.isAuthenticated', true);
  attemptedTransitionMock.aborted = false;
  testRoute.beforeModel(attemptedTransitionMock);

  ok(!attemptedTransitionMock.aborted, 'Ember.SimpleAuth.AuthenticatedRouteMixin does not abort the attempted transition in beforeModel when the session is authenticated.');
});
