var loginFailedError;
var testController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin, {
  session: Ember.SimpleAuth.Session.create(),
  route:   null,

  transitionToRoute: function(targetRoute) {
    this.route = targetRoute;
  },
  loginFailed: function(error) {
    loginFailedError = error;
  }
}).create();

var ajaxRequestUrl;
var ajaxRequestOptions;
var ajaxMock = function(url, options) {
  ajaxRequestUrl     = url;
  ajaxRequestOptions = options;
  return {
    then: function(success, fail) {
      success({ session: { authToken: 'authToken' } });
      fail('error!', 'and another one');
    }
  };
};

module('Ember.SimpleAuth.LoginControllerMixin', {
  originalAjax: Ember.$.ajax,
  setup: function() {
    Ember.SimpleAuth.serverSessionRoute = '/session/route';
    testController.setProperties({ identification: 'identification', password: 'password' });
    testController.session.destroy();
    loginFailedError   = undefined;
    ajaxRequestUrl     = undefined;
    ajaxRequestOptions = undefined;
    Ember.$.ajax       = ajaxMock;
  },
  teardown: function() {
    Ember.$.ajax = this.originalAjax;
  }
});

test('sends a POST request to the correct route', function() {
  testController.send('login');

  equal(ajaxRequestUrl, '/session/route', 'Ember.SimpleAuth.LoginControllerMixin sends a request to the correct route on submit.');
  equal(ajaxRequestOptions.type, 'POST', 'Ember.SimpleAuth.LoginControllerMixin sends a POST request on submit.');
  equal(ajaxRequestOptions.data, '{"session":{"identification":"identification","password":"password"}}', 'Ember.SimpleAuth.LoginControllerMixin sends a request with the correct data on submit.');
  equal(ajaxRequestOptions.contentType, 'application/json', 'Ember.SimpleAuth.LoginControllerMixin sends a request with the correct content type on submit.');

  ajaxRequestUrl = undefined;
  testController.setProperties({ identification: '', password: 'password' });
  testController.send('login');

  equal(ajaxRequestUrl, undefined, 'Ember.SimpleAuth.LoginControllerMixin does not send a request on submit when identification or password are empty.');
});

test('does not send a request when identification or password are empty', function() {
  testController.setProperties({ identification: '', password: 'password' });
  testController.send('login');

  equal(ajaxRequestUrl, undefined, 'Ember.SimpleAuth.LoginControllerMixin does not send a request on submit when identification is empty.');

  testController.setProperties({ identification: 'identification', password: '' });
  testController.send('login');

  equal(ajaxRequestUrl, undefined, 'Ember.SimpleAuth.LoginControllerMixin does not send a request on submit when password is empty.');

  testController.setProperties({ identification: '', password: '' });
  testController.send('login');

  equal(ajaxRequestUrl, undefined, 'Ember.SimpleAuth.LoginControllerMixin does not send a request on submit when identification and password are empty.');
});

test('serializes the credentials correctly when a custom serialization method is provided', function() {
  testController.reopen({
    serializeCredentials: function(identification, password) {
      return { custom: { credentials: identification + '.' + password } };
    }
  });
  testController.send('login');

  equal(ajaxRequestOptions.data, '{"custom":{"credentials":"identification.password"}}', 'Ember.SimpleAuth.LoginControllerMixin serializes the credentials correctly when a custom serialization method is provided.');
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

test('invokes the loginFailed method with the callback arguments', function() {
  testController.send('login');

  equal(loginFailedError, 'error!', 'Ember.SimpleAuth.LoginControllerMixin invokes the loginFailed action with the callback arguments when the request fails.');
});
