var session;

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

module('Ember.SimpleAuth.Session', {
  originalAjax: Ember.$.ajax,
  setup: function() {
    session      = Ember.SimpleAuth.Session.create();
    ajaxMock     = AjaxMock.create();
    Ember.$.ajax = Ember.$.proxy(ajaxMock.ajaxCapture, ajaxMock);
  },
  teardown: function() {
    Ember.$.ajax = this.originalAjax;
    Ember.run.cancel(Ember.SimpleAuth.Session._REFRESH_TOKEN_TIMEOUT_);
    Ember.run.cancel(Ember.SimpleAuth.Session._SYNC_PROPERTIES_TIMEOUT_);
    session.destroy();
  }
});

test('reads its properties from session cookies during initialization', function() {
  Ember.SimpleAuth.autoRefreshToken = true;
  var authToken = Math.random().toString(36);
  document.cookie = 'authToken=' + authToken;
  var refreshToken = Math.random().toString(36);
  document.cookie = 'refreshToken=' + refreshToken;
  document.cookie = 'authTokenExpiry=' + 10000;
  session = Ember.SimpleAuth.Session.create();

  equal(session.get('authToken'), authToken, 'Ember.SimpleAuth.Session reads authToken from the session cookie during initialization.');
  equal(session.get('refreshToken'), refreshToken, 'Ember.SimpleAuth.Session reads refreshToken from the session cookie during initialization.');
  equal(session.get('authTokenExpiry'), 10000, 'Ember.SimpleAuth.Session reads authTokenExpiry from the session cookie during initialization.');
  notEqual(Ember.SimpleAuth.Session._REFRESH_TOKEN_TIMEOUT_, undefined, 'Ember.SimpleAuth.Session schedules a token refresh during initialization.');
});

test('persists its properties to session cookies when they change', function() {
  var authToken = Math.random().toString(36);
  session.set('authToken', authToken);

  ok(document.cookie.match(new RegExp('authToken=' + authToken)), 'Ember.SimpleAuth.Session persists authToken to a session cookie when it changes.');

  var refreshToken = Math.random().toString(36);
  session.set('refreshToken', refreshToken);

  ok(document.cookie.match(new RegExp('refreshToken=' + refreshToken)), 'Ember.SimpleAuth.Session persists refreshToken to a session cookie when it changes.');

  session.set('authTokenExpiry', 1);

  ok(document.cookie.match(new RegExp('authTokenExpiry=1')), 'Ember.SimpleAuth.Session persists authTokenExpiry to a session cookie when it changes.');
});

test('deletes its properties from session cookies when they become empty', function() {
  session.set('authToken', 'some token');
  session.set('authToken', undefined);

  ok(!document.cookie.match(new RegExp('authToken=[^;]+')), 'Ember.SimpleAuth.Session deletes authToken from the session cookie when it becomes empty.');

  session.set('refreshToken', 'some token');
  session.set('refreshToken', undefined);

  ok(!document.cookie.match(new RegExp('refreshToken=[^;]+')), 'Ember.SimpleAuth.Session deletes refreshToken from the session cookie when it becomes empty.');

  session.set('authTokenExpiry', 1);
  session.set('authTokenExpiry', undefined);

  ok(!document.cookie.match(new RegExp('authTokenExpiry=[^;]+')), 'Ember.SimpleAuth.Session deletes authTokenExpiry from the session cookie when it becomes empty.');
});

test('assigns its properties correctly during setup', function() {
  var authToken = Math.random().toString(36);
  var refreshToken = Math.random().toString(36);
  session.setup({ access_token: authToken, refresh_token: refreshToken, expires_in: 1 });

  equal(session.get('authToken'), authToken, 'Ember.SimpleAuth.Session assigns authToken correctly during setup.');
  equal(session.get('refreshToken'), refreshToken, 'Ember.SimpleAuth.Session assigns refreshToken correctly during setup.');
  equal(session.get('authTokenExpiry'), 1000, 'Ember.SimpleAuth.Session assigns authTokenExpiry correctly during setup.');

  session.setup({ access_token: authToken });

  equal(session.get('refreshToken'), refreshToken, 'Ember.SimpleAuth.Session keeps an existing refreshToken when the supplied session does not contain one.');
  equal(session.get('authTokenExpiry'), 1000, 'Ember.SimpleAuth.Session keeps an existing authTokenExpiry when the supplied session does not contain one.');

  session.destroy();
  session = Ember.SimpleAuth.Session.create();
  session.setup({});

  equal(session.get('authToken'), undefined, 'Ember.SimpleAuth.Session assigns authToken as undefined during setup when the supplied session is empty.');
  equal(session.get('refreshToken'), undefined, 'Ember.SimpleAuth.Session assigns refreshToken as undefined during setup when the supplied session is empty.');
  equal(session.get('authTokenExpiry'), 0, 'Ember.SimpleAuth.Session assigns authTokenExpiry as 0 during setup when the supplied session is empty.');

  session.setup(null);

  equal(session.get('authToken'), undefined, 'Ember.SimpleAuth.Session assigns authToken as undefined during setup when the supplied session is null.');
  equal(session.get('refreshToken'), undefined, 'Ember.SimpleAuth.Session assigns refreshToken as undefined during setup when the supplied session is null.');
  equal(session.get('authTokenExpiry'), 0, 'Ember.SimpleAuth.Session assigns authTokenExpiry as 0 during setup when the supplied session is null.');
});

test('clears its properties during destruction', function() {
  session.set('authToken', 'some Token');
  session.set('refreshToken', 'some Token');
  session.set('authTokenExpiry', 1);
  session.destroy();

  equal(session.get('authToken'), undefined, 'Ember.SimpleAuth.Session clears authToken during destruction.');
  equal(session.get('refreshToken'), undefined, 'Ember.SimpleAuth.Session clears refreshToken during destruction.');
  equal(session.get('authTokenExpiry'), undefined, 'Ember.SimpleAuth.Session clears authTokenExpiry during destruction.');
});

test('is authenticated when the auth token is present, otherwise not', function() {
  session.set('authToken', Math.random().toString(36));

  ok(session.get('isAuthenticated'), 'Ember.SimpleAuth.Session is authenticated when authToken is present.');

  session.set('authToken', '');
  ok(!session.get('isAuthenticated'), 'Ember.SimpleAuth.Session is not authenticated when authToken is empty.');

  session.set('authToken', null);
  ok(!session.get('isAuthenticated'), 'Ember.SimpleAuth.Session is not authenticated when authToken is null.');

  session.set('authToken', undefined);
  ok(!session.get('isAuthenticated'), 'Ember.SimpleAuth.Session is not authenticated when authToken is undefined.');
});

test('schedules a token refresh when the required properties are set', function() {
  Ember.SimpleAuth.autoRefreshToken = false;
  session.setup({ access_token: 'authToken', refresh_token: 'refreshToken', expires_in: 10 });

  equal(Ember.SimpleAuth.Session._REFRESH_TOKEN_TIMEOUT_, undefined, 'Ember.SimpleAuth.Session does not schedule a token refresh when an Ember.SimpleAuth.autoRefreshToken is false.');

  Ember.SimpleAuth.autoRefreshToken = true;
  session.setup({ access_token: 'authToken', refresh_token: 'refreshToken' });

  equal(Ember.SimpleAuth.Session._REFRESH_TOKEN_TIMEOUT_, undefined, 'Ember.SimpleAuth.Session does not schedule a token refresh when no authTokenExpiry is present.');

  session.setup({ access_token: 'authToken', refresh_token: 'refreshToken', expires_in: 5 });

  equal(Ember.SimpleAuth.Session._REFRESH_TOKEN_TIMEOUT_, undefined, 'Ember.SimpleAuth.Session does not schedule a token refresh when an authTokenExpiry less or equal 5000ms is present.');

  session.setup({ access_token: 'authToken', refresh_token: 'refreshToken', expires_in: 10 });

  notEqual(Ember.SimpleAuth.Session._REFRESH_TOKEN_TIMEOUT_, undefined, 'Ember.SimpleAuth.Session schedules a token refresh when the refreshToken and authTokenExpiry are present.');
});
