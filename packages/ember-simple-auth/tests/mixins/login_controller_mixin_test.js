var testController;
var TestController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin, {
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

module('Ember.SimpleAuth.LoginControllerMixin', {
  setup: function() {
    testController = TestController.create();
    sessionMock    = SessionMock.create();
    testController.set('session', sessionMock);
<<<<<<< HEAD
    testController.setProperties({ identification: 'identification', password: 'password', remember_me: false });
=======
    testController.setProperties({ identification: 'identification', password: 'password' });
>>>>>>> 672ddb856aedde0627f1d62949c8940f58f31a70
  }
});

test('authenticates the session', function() {
  Ember.run(function() {
<<<<<<< HEAD
    testController.setProperties({ identification: 'identification', password: 'password', remember_me: false });
=======
    testController.setProperties({ identification: 'identification', password: 'password' });
>>>>>>> 672ddb856aedde0627f1d62949c8940f58f31a70
    testController.send('authenticate');
  });

  ok(sessionMock.invokedAuthenticate, 'Ember.SimpleAuth.LoginControllerMixin authenticates the session when authentication is triggered.');
  equal(sessionMock.invokedAuthenticateWith.authenticator, 'ember-simple-auth:authenticators:oauth2', 'Ember.SimpleAuth.LoginControllerMixin authenticates the session with the correct authenticator.');
<<<<<<< HEAD
  deepEqual(sessionMock.invokedAuthenticateWith.options, { identification: 'identification', password: 'password', remember_me: false }, 'Ember.SimpleAuth.LoginControllerMixin authenticates the session with identification, password, and remember_me.');
=======
  deepEqual(sessionMock.invokedAuthenticateWith.options, { identification: 'identification', password: 'password' }, 'Ember.SimpleAuth.LoginControllerMixin authenticates the session with identification and password.');
>>>>>>> 672ddb856aedde0627f1d62949c8940f58f31a70
});

test('does not authenticate the session when identification or password are empty', function() {
  testController.setProperties({ identification: '', password: 'password' });
  testController.send('authenticate');

  ok(!sessionMock.invokedAuthenticate, 'Ember.SimpleAuth.LoginControllerMixin does not authenticate the session when authentication is triggered but identification is empty.');

  testController.setProperties({ identification: 'identification', password: '' });
  testController.send('authenticate');

  ok(!sessionMock.invokedAuthenticate, 'Ember.SimpleAuth.LoginControllerMixin does not authenticate the session when authentication is triggered but password is empty.');

  testController.setProperties({ identification: '', password: '' });
  testController.send('authenticate');

  ok(!sessionMock.invokedAuthenticate, 'Ember.SimpleAuth.LoginControllerMixin does not authenticate the session when authentication is triggered but identification and password are empty.');
});

test('triggers the authenticationSucceeded action when authentication is successful', function() {
  SessionMock._resolve = true;
  Ember.run(function() {
    testController.send('authenticate');
  });

  ok(testController.invokedSessionAuthenticationSucceeded, 'Ember.SimpleAuth.LoginControllerMixin triggers the sessionAuthenticationSucceeded action when authentication was successful.');
});

test('triggers the authenticationFailed action when authentication fails', function() {
  SessionMock._resolve = false;
  SessionMock._reject = 'error!';
  Ember.run(function() {
    testController.send('authenticate');
  });

  ok(testController.invokedSessionAuthenticationFailed, 'Ember.SimpleAuth.LoginControllerMixin triggers the sessionAuthenticationFailed action when authentication fails.');
  equal(testController.invokedSessionAuthenticationFailedWith, 'error!', 'Ember.SimpleAuth.LoginControllerMixin triggers the sessionAuthenticationFailed action with the rejection value of the session.');
});
