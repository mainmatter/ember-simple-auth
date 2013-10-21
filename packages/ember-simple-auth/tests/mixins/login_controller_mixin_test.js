var testController;
var TestController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin, {
  actions: {
    loginSucceeded: function() {
      this.invokedLoginSucceeded = true;
    },
    loginFailed: function(xhr, status, error) {
      this.invokedLoginFailed   = true;
      this.loginFailedArguments = [xhr, status, error];
    }
  }
});

var ajaxMock;
var AjaxMock = Ember.Object.extend({
  response:    { access_token: 'authToken' },
  ajaxCapture: function(url, options) {
    var self            = this;
    this.requestUrl     = url;
    this.requestOptions = options;
    return {
      then: function(success, fail) {
        if (!!success) {
          success(self.response);
        }
        if (!!fail) {
          fail('xhr', 'status', 'error');
        }
      }
    };
  }
});

module('Ember.SimpleAuth.LoginControllerMixin', {
  originalAjax: Ember.$.ajax,
  setup: function() {
    testController                      = TestController.create();
    ajaxMock                            = AjaxMock.create();
    Ember.SimpleAuth.serverTokenRoute = '/token/route';
    Ember.$.ajax                        = Ember.$.proxy(ajaxMock.ajaxCapture, ajaxMock);
    testController.set('session', Ember.SimpleAuth.Session.create());
    testController.setProperties({ identification: 'identification', password: 'password' });
  },
  teardown: function() {
    Ember.$.ajax = this.originalAjax;
    Ember.run.cancel(testController.refreshTokenLater);
  }
});

test('sends a POST request to the server token route on login', function() {
  testController.send('login');

  equal(ajaxMock.requestUrl, '/token/route', 'Ember.SimpleAuth.LoginControllerMixin sends a request to the serverTokenRoute on login.');
  equal(ajaxMock.requestOptions.type, 'POST', 'Ember.SimpleAuth.LoginControllerMixin sends a POST request on login.');
  equal(ajaxMock.requestOptions.data, 'grant_type=password&username=identification&password=password', 'Ember.SimpleAuth.LoginControllerMixin sends a request with the correct data on login.');
  equal(ajaxMock.requestOptions.contentType, 'application/x-www-form-urlencoded', 'Ember.SimpleAuth.LoginControllerMixin sends a request with the content type "application/x-www-form-urlencoded" on login.');
});

test('does not send a request on login when identification or password are empty', function() {
  testController.setProperties({ identification: '', password: 'password' });
  testController.send('login');

  equal(ajaxMock.requestUrl, undefined, 'Ember.SimpleAuth.LoginControllerMixin does not send a request on login when identification is empty.');

  testController.setProperties({ identification: 'identification', password: '' });
  testController.send('login');

  equal(ajaxMock.requestUrl, undefined, 'Ember.SimpleAuth.LoginControllerMixin does not send a request on login when password is empty.');

  testController.setProperties({ identification: '', password: '' });
  testController.send('login');

  equal(ajaxMock.requestUrl, undefined, 'Ember.SimpleAuth.LoginControllerMixin does not send a request on login when identification and password are empty.');
});

test('updates the current session with the server response on login', function() {
  testController.send('login');

  equal(testController.session.get('authToken'), 'authToken', 'Ember.SimpleAuth.LoginControllerMixin updates the current session with the server response on login.');
});

test('invokes the login succeeded action when login is successful', function() {
  testController.send('login');

  ok(testController.invokedLoginSucceeded, 'Ember.SimpleAuth.LoginControllerMixin invokes the loginSucceeded action when login is successful.');
});

test('invokes the login failed action with the callback arguments', function() {
  testController.send('login');

  ok(testController.invokedLoginFailed, 'Ember.SimpleAuth.LoginControllerMixin invokes the loginFailed action when the request fails.');
  deepEqual(testController.loginFailedArguments, ['xhr', 'status', 'error'], 'Ember.SimpleAuth.LoginControllerMixin invokes the loginFailed action with the callback arguments when the request fails.');
});

test('schedules a token refresh on login', function() {
  ajaxMock.response = { access_token: 'authToken', expires_in: 100 };
  testController.send('login');

  equal(testController.refreshTokenLater, undefined, 'Ember.SimpleAuth.LoginControllerMixin does not schedule a token refresh when the server reponse does not contain a refresh_token on login.');

  ajaxMock.response = { access_token: 'authToken', refresh_token: 'refresh_token' };
  testController.send('login');

  equal(testController.refreshTokenLater, undefined, 'Ember.SimpleAuth.LoginControllerMixin does not schedule a token refresh when the server reponse does not contain a expires_in on login.');

  ajaxMock.response = { access_token: 'authToken', refresh_token: 'refresh_token', expires_in: 10 };
  testController.send('login');

  equal(testController.refreshTokenLater, undefined, 'Ember.SimpleAuth.LoginControllerMixin does not schedule a token refresh when the server reponse contains a expires_in less or equal 10 on login.');

  ajaxMock.response = { access_token: 'authToken', refresh_token: 'refresh_token', expires_in: 100 };
  testController.send('login');

  notEqual(testController.refreshTokenLater, undefined, 'Ember.SimpleAuth.LoginControllerMixin schedules a token refresh when the server reponse contains a refresh_token and a expires_in on login.');
});

test('refreshes the token', function() {
  ajaxMock.response = { access_token: 'authToken', refresh_token: 'refresh_token', expires_in: 100 };
  testController.send('login');
  testController.refreshToken('refresh_token');

  equal(ajaxMock.requestUrl, '/token/route', 'Ember.SimpleAuth.LoginControllerMixin sends a request to the serverTokenRoute to refresh the token.');
  equal(ajaxMock.requestOptions.type, 'POST', 'Ember.SimpleAuth.LoginControllerMixin sends a POST request to refresh the token.');
  equal(ajaxMock.requestOptions.data, 'grant_type=refresh_token&refresh_token=refresh_token', 'Ember.SimpleAuth.LoginControllerMixin sends a request with the correct data to refresh the token.');
  equal(ajaxMock.requestOptions.contentType, 'application/x-www-form-urlencoded', 'Ember.SimpleAuth.LoginControllerMixin sends a request with the content type "application/x-www-form-urlencoded" to refresh the token.');
  notEqual(testController.refreshTokenLater, undefined, 'Ember.SimpleAuth.LoginControllerMixin schedules another token refresh when the server reponse contains a refresh_token and a expires_in on token refresh.');
});
