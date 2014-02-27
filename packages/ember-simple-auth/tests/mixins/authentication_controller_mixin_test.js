var AuthenticatorMock = Ember.Object.extend();

var testController;
var TestController = Ember.Controller.extend(Ember.SimpleAuth.AuthenticationControllerMixin, {
  authenticator: 'authenticators:test',
  actions: {
    sessionAuthenticationSucceeded: function() {
      this.invokedSessionAuthenticationSucceeded = true;
    },
    sessionAuthenticationFailed: function(error) {
      this.invokedSessionAuthenticationFailed     = true;
      this.invokedSessionAuthenticationFailedWith = error;
    }
  }
});

var sessionMock;
var SessionMock = Ember.Object.extend({
  authenticate: function(authenticator, options) {
    this.invokedAuthenticate     = true;
    this.invokedAuthenticateWith = { authenticator: authenticator, options: options };
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!!SessionMock._resolve) {
        resolve(SessionMock._resolve);
      } else {
        reject(SessionMock._reject);
      }
    });
  }
});

module('Ember.SimpleAuth.AuthenticationControllerMixin', {
  setup: function() {
    testController = TestController.create();
    sessionMock    = SessionMock.create();
    testController.set('session', sessionMock);
  }
});

test('authenticates the session', function() {
  Ember.run(function() {
    testController.send('authenticate', { 'key': 'value' });
  });

  ok(sessionMock.invokedAuthenticate, 'Ember.SimpleAuth.AuthenticationControllerMixin authenticates the session when authentication is triggered.');
  equal(sessionMock.invokedAuthenticateWith.authenticator, 'authenticators:test', 'Ember.SimpleAuth.AuthenticationControllerMixin authenticates the session with the correct authenticator.');
  deepEqual(sessionMock.invokedAuthenticateWith.options, { 'key': 'value' }, 'Ember.SimpleAuth.AuthenticationControllerMixin authenticates the session with the correct options.');
});
