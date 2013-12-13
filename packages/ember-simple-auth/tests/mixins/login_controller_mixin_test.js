var testController;
var TestController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin, {
  actions: {
    loginSucceeded: function() {
      this.invokedLoginSucceeded = true;
    },
    loginFailed: function(error) {
      this.invokedLoginFailed     = true;
      this.invokedLoginFailedWith = error;
    }
  }
});

var sessionMock;
var SessionMock = Ember.Object.extend({
  authenticate: function() {
    this.invokedAuthenticate = true;
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
    testController.setProperties({ identification: 'identification', password: 'password' });
  }
});

test('authenticates the session on login', function() {
  Ember.run(function() {
    testController.send('login');
  });

  ok(sessionMock.invokedAuthenticate, 'Ember.SimpleAuth.LoginControllerMixin authenticates the session on login.');
});

test('does not authenticate the session when identification or password are empty', function() {
  testController.setProperties({ identification: '', password: 'password' });
  testController.send('login');

  ok(!sessionMock.invokedAuthenticate, 'Ember.SimpleAuth.LoginControllerMixin does not authenticate the session on login when identification is empty.');

  testController.setProperties({ identification: 'identification', password: '' });
  testController.send('login');

  ok(!sessionMock.invokedAuthenticate, 'Ember.SimpleAuth.LoginControllerMixin does not authenticate the session on login when password is empty.');

  testController.setProperties({ identification: '', password: '' });
  testController.send('login');

  ok(!sessionMock.invokedAuthenticate, 'Ember.SimpleAuth.LoginControllerMixin does not authenticate the session on login when identification and password are empty.');
});

test('invokes the login succeeded action when login is successful', function() {
  SessionMock._resolve = true;
  Ember.run(function() {
    testController.send('login');
  });

  ok(testController.invokedLoginSucceeded, 'Ember.SimpleAuth.LoginControllerMixin invokes the loginSucceeded action when login is successful.');
});

test('invokes the login failed action with the callback arguments', function() {
  SessionMock._resolve = false;
  SessionMock._reject = 'error!';
  Ember.run(function() {
    testController.send('login');
  });

  ok(testController.invokedLoginFailed, 'Ember.SimpleAuth.LoginControllerMixin invokes the loginFailed action when the request fails.');
  equal(testController.invokedLoginFailedWith, 'error!', 'Ember.SimpleAuth.LoginControllerMixin invokes the loginFailed action with the rejection value of the session.');
});
