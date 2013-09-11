var loginFailedError;
var testController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin, {
  session: Ember.SimpleAuth.Session.create(),
  route:   null,

  transitionToRoute: function(targetRoute) {
    this.route = targetRoute;
  },

  actions: {
    loginFailed: function(args) {
      loginFailedError = args[0];
    }
  }
}).create();

var postRequestUrl;
var postRequestData;
var postMock = function(url, data) {
  postRequestUrl = url;
  postRequestData = data;
  return {
    then: function(success, fail) {
      success({ session: { authToken: 'authToken' } });
      fail('error!');
    }
  };
};

module('Ember.SimpleAuth.LoginControllerMixin', {
  originalPost: Ember.$.post,
  setup: function() {
    Ember.SimpleAuth.serverSessionRoute = '/session/route';
    testController.setProperties({ identification: 'identification', password: 'password' });
    testController.session.destroy();
    loginFailedError = undefined;
    Ember.$.post = postMock;
  },
  teardown: function() {
    Ember.$.post = this.originalPost;
  }
});

test('sends a POST request to the correct route', function() {
  testController.send('login');

  equal(postRequestUrl, '/session/route', 'Ember.SimpleAuth.LoginControllerMixin sends a request to the correct route on submit.');
  equal(postRequestData.session.identification, 'identification', 'Ember.SimpleAuth.LoginControllerMixin sends a request with the correct identification on submit.');
  equal(postRequestData.session.password, 'password', 'Ember.SimpleAuth.LoginControllerMixin sends a request with the correct password on submit.');

  postRequestUrl = undefined;
  testController.setProperties({ identification: '', password: 'password' });
  testController.send('login');

  equal(postRequestUrl, undefined, 'Ember.SimpleAuth.LoginControllerMixin does not send a request on submit when identification or password are empty.');
});

test('updates the current session with the server response', function() {
  testController.send('login');

  equal(testController.session.get('authToken'), 'authToken', 'Ember.SimpleAuth.LoginControllerMixin updates the current session with the server response on submit.');
});

test('redirects to the correct route on submit', function() {
  Ember.SimpleAuth.routeAfterLogin = 'some.route';
  testController.send('login');

  equal(testController.route, 'some.route', 'Ember.SimpleAuth.LoginControllerMixin redirects to the routeAfterLogin route on submit when no attempted transition is stored.');

  var retried = false;
  testController.session.set('attemptedTransition', { retry: function() { retried = true; } });
  testController.send('login');

  ok(retried, 'Ember.SimpleAuth.LoginControllerMixin redirects retries an attempted transition on submit.');
});

test('invokes the loginFailed action with the callback arguments', function() {
  testController.send('login');

  equal(loginFailedError, 'error!', 'Ember.SimpleAuth.LoginControllerMixin invokes the loginFailed action with the callback arguments when the request fails.');
});
