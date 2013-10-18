var testRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
  invokedLogin: false,

  send: function(name) {
    this.invokedLogin = (name === 'login');
  }
}).create();

var attemptedTransitionMock = { abort: function() { this.aborted = true; } };

module('Ember.SimpleAuth.AuthenticatedRouteMixin', {
  setup: function() {
    Ember.SimpleAuth.loginRoute = 'login.route';
    testRoute.set('session', Ember.SimpleAuth.Session.create());
  }
});

test('triggers the login correctly', function() {
  testRoute.triggerLogin(attemptedTransitionMock);

  equal(testRoute.get('session.attemptedTransition'), attemptedTransitionMock, 'Ember.SimpleAuth.AuthenticatedRouteMixin saves the attempted transition in the session when login is triggered.');
  ok(testRoute.invokedLogin, 'Ember.SimpleAuth.AuthenticatedRouteMixin invokes the login action on the route when login is triggered.');
});

test('triggers the login before model when the session is not authenticated', function() {
  testRoute.set('session.authToken', '');
  testRoute.beforeModel(attemptedTransitionMock);

  ok(testRoute.invokedLogin, 'Ember.SimpleAuth.AuthenticatedRouteMixin triggers login before model when the session is not authenticated.');

  testRoute.set('session.authToken', 'token');
  testRoute.invokedLogin = false;
  testRoute.beforeModel(attemptedTransitionMock);

  ok(!testRoute.invokedLogin, 'Ember.SimpleAuth.AuthenticatedRouteMixin does not trigger login before model when the session is authenticated.');
});

test('aborts the attempted transaction before model when the session is not authenticated', function() {
  testRoute.set('session.authToken', '');
  testRoute.beforeModel(attemptedTransitionMock);

  ok(attemptedTransitionMock.aborted, 'Ember.SimpleAuth.AuthenticatedRouteMixin aborts the attempted transition before model when the session is not authenticated.');

  testRoute.set('session.authToken', 'token');
  attemptedTransitionMock.aborted = false;
  testRoute.beforeModel(attemptedTransitionMock);

  ok(!attemptedTransitionMock.aborted, 'Ember.SimpleAuth.AuthenticatedRouteMixin does not abort the attempted transition before model when the session is authenticated.');
});
