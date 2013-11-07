var testRoute;
var TestRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
  send: function(name) {
    this.invokedLogin = (name === 'login');
  }
});

var attemptedTransitionMock;
var AttemptedTransitionMock = Ember.Object.extend({
  abort: function() {
    this.aborted = true;
  },
  send: function(name) {
    this.invokedLogin = (name === 'login');
  }
});

module('Ember.SimpleAuth.AuthenticatedRouteMixin', {
  setup: function() {
    testRoute                   = TestRoute.create();
    attemptedTransitionMock     = AttemptedTransitionMock.create();
    Ember.SimpleAuth.loginRoute = 'login.route';
    var session                 = Ember.SimpleAuth.Session.create();
    session.destroy();
    testRoute.set('session', session);
  },
  teardown: function() {
    Ember.run.cancel(Ember.SimpleAuth.Session._syncPropertiesTimeout_);
  }
});

test('triggers the login correctly', function() {
  testRoute.triggerLogin(attemptedTransitionMock);

  equal(testRoute.get('session.attemptedTransition'), attemptedTransitionMock, 'Ember.SimpleAuth.AuthenticatedRouteMixin saves the attempted transition in the session when login is triggered.');
  ok(attemptedTransitionMock.invokedLogin, 'Ember.SimpleAuth.AuthenticatedRouteMixin invokes the login action on the attempted transition when login is triggered.');
  ok(!testRoute.invokedLogin, 'Ember.SimpleAuth.AuthenticatedRouteMixin does not invoke the login action on the route if the attempted transition supports it when login is triggered.');

  testRoute.triggerLogin({});

  ok(testRoute.invokedLogin, 'Ember.SimpleAuth.AuthenticatedRouteMixin invokes the login action on the route if the attempted transition does not support it when login is triggered.');
});

test('triggers the login before model when the session is not authenticated', function() {
  testRoute.set('session.authToken', '');
  testRoute.beforeModel(attemptedTransitionMock);

  ok(attemptedTransitionMock.invokedLogin, 'Ember.SimpleAuth.AuthenticatedRouteMixin triggers login before model when the session is not authenticated.');

  testRoute.set('session.authToken', 'token');
  attemptedTransitionMock.invokedLogin = false;
  testRoute.beforeModel(attemptedTransitionMock);

  ok(!attemptedTransitionMock.invokedLogin, 'Ember.SimpleAuth.AuthenticatedRouteMixin does not trigger login before model when the session is authenticated.');
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
