var testController;
var TestController = Ember.Controller.extend(Ember.SimpleAuth.AuthenticationControllerMixin, {
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
    testController.setProperties({ identification: 'identification', password: 'password' });
  }
});

test('authenticates the session', function() {
  Ember.run(function() {
    testController.setProperties({ identification: 'identification', password: 'password' });
    testController.send('authenticate');
  });

  ok(sessionMock.invokedAuthenticate, 'Ember.SimpleAuth.AuthenticationControllerMixin authenticates the session when authentication is triggered.');
  ok(sessionMock.invokedAuthenticateWith.authenticator instanceof Ember.SimpleAuth.Authenticators.OAuth2, 'Ember.SimpleAuth.AuthenticationControllerMixin authenticates the session with the correct authenticator.');
  deepEqual(sessionMock.invokedAuthenticateWith.options, { identification: 'identification', password: 'password' }, 'Ember.SimpleAuth.AuthenticationControllerMixin authenticates the session with identification and password.');
});

test('does not authenticate the session when identification or password are empty', function() {
  testController.setProperties({ identification: '', password: 'password' });
  testController.send('authenticate');

  ok(!sessionMock.invokedAuthenticate, 'Ember.SimpleAuth.AuthenticationControllerMixin does not authenticate the session when authentication is triggered but identification is empty.');

  testController.setProperties({ identification: 'identification', password: '' });
  testController.send('authenticate');

  ok(!sessionMock.invokedAuthenticate, 'Ember.SimpleAuth.AuthenticationControllerMixin does not authenticate the session when authentication is triggered but password is empty.');

  testController.setProperties({ identification: '', password: '' });
  testController.send('authenticate');

  ok(!sessionMock.invokedAuthenticate, 'Ember.SimpleAuth.AuthenticationControllerMixin does not authenticate the session when authentication is triggered but identification and password are empty.');
});

test('triggers the authenticationSucceeded action when authentication is successful', function() {
  SessionMock._resolve = true;
  Ember.run(function() {
    testController.send('authenticate');
  });

  ok(testController.invokedSessionAuthenticationSucceeded, 'Ember.SimpleAuth.AuthenticationControllerMixin triggers the sessionAuthenticationSucceeded action when authentication was successful.');
});

test('triggers the authenticationFailed action when authentication fails', function() {
  SessionMock._resolve = false;
  SessionMock._reject = 'error!';
  Ember.run(function() {
    testController.send('authenticate');
  });

  ok(testController.invokedSessionAuthenticationFailed, 'Ember.SimpleAuth.AuthenticationControllerMixin triggers the sessionAuthenticationFailed action when authentication fails.');
  equal(testController.invokedSessionAuthenticationFailedWith, 'error!', 'Ember.SimpleAuth.AuthenticationControllerMixin triggers the sessionAuthenticationFailed action with the rejection value of the session.');
});
