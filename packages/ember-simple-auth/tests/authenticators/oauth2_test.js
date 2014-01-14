var authenticator;

var ajaxMock;
var AjaxMock = Ember.Object.extend({
  ajaxCapture: function(options) {
    this.requestOptions = options;
    return {
      then: function(success, fail) {
        if (AjaxMock._resolve) {
          success(AjaxMock._resolve);
        } else if (AjaxMock._reject) {
          fail(AjaxMock._reject);
        }
      }
    };
  }
});

module('Ember.SimpleAuth.Authenticators.OAuth2', {
  originalAjax: Ember.$.ajax,
  setup: function() {
    authenticator = Ember.SimpleAuth.Authenticators.OAuth2.create();
    ajaxMock      = AjaxMock.create();
    Ember.$.ajax  = Ember.$.proxy(ajaxMock.ajaxCapture, ajaxMock);
  },
  teardown: function() {
    Ember.run.cancel(authenticator._refreshTokenTimeout);
    Ember.$.ajax = this.originalAjax;
  }
});

test('restores the session', function() {
  var resolved;
  var resolvedWith;
  Ember.run(function() {
    authenticator.restore({ access_token: 'access_token', key: 'value' }).then(function(properties) {
      resolved     = true;
      resolvedWith = properties;
    });
  });

  ok(resolved, 'Ember.SimpleAuth.Authenticators.OAuth2 returns a resolving promise when the properties it restores the session from include an access_token.');
  deepEqual(resolvedWith, { access_token: 'access_token', key: 'value' }, 'Ember.SimpleAuth.Authenticators.OAuth2 returns a promise that resolves with the passed properties when the passed properties it restores the session from include an access_token.');

  var rejected;
  Ember.run(function() {
    authenticator.restore({}).then(function() {}, function() {
      rejected = true;
    });
  });

  ok(rejected, 'Ember.SimpleAuth.Authenticators.OAuth2 returns a rejecting promise when the properties it restores the session from do not include an access_token.');

  rejected = false;
  Ember.run(function() {
    authenticator.restore({ access_token: '' }).then(function() {}, function() {
      rejected = true;
    });
  });

  ok(rejected, 'Ember.SimpleAuth.Authenticators.OAuth2 returns a rejecting promise when the properties it restores the session from include an empty access_token.');
});

test('issues an AJAX request to authenticate', function() {
  Ember.run(function() {
    authenticator.authenticate({ identification: 'identification', password: 'password' });
  });

  equal(ajaxMock.requestOptions.url, '/token', 'Ember.SimpleAuth.Authenticators.OAuth2 sends a request to the serverTokenEndpoint to authenticate.');
  equal(ajaxMock.requestOptions.type, 'POST', 'Ember.SimpleAuth.Authenticators.OAuth2 sends a POST request to authenticate.');
  deepEqual(ajaxMock.requestOptions.data, { grant_type: 'password', password: 'password', username: 'identification' }, 'Ember.SimpleAuth.Authenticators.OAuth2 sends a request with the correct data to authenticate.');
  equal(ajaxMock.requestOptions.dataType, 'json', 'Ember.SimpleAuth.Authenticators.OAuth2 sends a request with the data type "json" to authenticate.');
  equal(ajaxMock.requestOptions.contentType, 'application/x-www-form-urlencoded', 'Ember.SimpleAuth.Authenticators.OAuth2 sends a request with the content type "application/x-www-form-urlencoded" to authenticate.');
});

test('returns a promise on authentication', function() {
  AjaxMock._resolve = { access_token: 'access_token' };
  var resolved;
  var resolvedWith;
  Ember.run(function() {
    authenticator.authenticate({}).then(function(properties) {
      resolved     = true;
      resolvedWith = properties;
    });
  });

  ok(resolved, 'Ember.SimpleAuth.Authenticators.OAuth2 returns a resolving promise when the authentication AJAX request is successful.');
  deepEqual(resolvedWith, { access_token: 'access_token' }, 'Ember.SimpleAuth.Authenticators.OAuth2 returns a promise that resolves with the server response when the authentication AJAX request is successful.');

  AjaxMock._resolve = false;
  AjaxMock._reject  = { responseText: 'error' };
  var rejected;
  var rejectedWith;
  Ember.run(function() {
    authenticator.authenticate({}).then(function() {}, function(error) {
      rejected     = true;
      rejectedWith = error;
    });
  });

  ok(rejected, 'Ember.SimpleAuth.Authenticators.OAuth2 returns a rejecting promise when the authentication AJAX request is not successful.');
  deepEqual(rejectedWith, 'error', 'Ember.SimpleAuth.Authenticators.OAuth2 returns a promise that rejects with the error message from the response when the authentication AJAX request is not successful.');
});

test('invalidates the session', function() {
  var resolved;
  Ember.run(function() {
    authenticator.invalidate().then(function(error) {
      resolved = true;
    });
  });

  ok(resolved, 'Ember.SimpleAuth.Authenticators.OAuth2 returns a resolving promise when invalidating.');
});

test('refreshes the access token', function() {
  Ember.run(function() {
    authenticator.refreshAccessToken(1, 'refresh token!');
  });

  equal(ajaxMock.requestOptions.url, '/token', 'Ember.SimpleAuth.Authenticators.OAuth2 sends a request to the serverTokenEndpoint to refresh the access token.');
  equal(ajaxMock.requestOptions.type, 'POST', 'Ember.SimpleAuth.Authenticators.OAuth2 sends a POST request to refresh the access token.');
  deepEqual(ajaxMock.requestOptions.data, { grant_type: 'refresh_token', refresh_token: 'refresh token!' }, 'Ember.SimpleAuth.Authenticators.OAuth2 sends a request with the correct data to refresh the access token.');
  equal(ajaxMock.requestOptions.dataType, 'json', 'Ember.SimpleAuth.Authenticators.OAuth2 sends a request with the data type "json" to refresh the access token.');
  equal(ajaxMock.requestOptions.contentType, 'application/x-www-form-urlencoded', 'Ember.SimpleAuth.Authenticators.OAuth2 sends a request with the content type "application/x-www-form-urlencoded" to refresh the access token.');
});

test('keeps the token fresh', function() {
  AjaxMock._resolve = false;
  Ember.run(function() {
    authenticator.refreshAccessToken(1, 'refresh token!');
  });

  ok(Ember.isEmpty(authenticator._refreshTokenTimeout), 'Ember.SimpleAuth.Authenticators.OAuth2 does not schedule another refresh when refreshing the access token failed.');

  AjaxMock._resolve = true;
  Ember.run(function() {
    authenticator.refreshAccessToken(5, 'refresh token!');
  });

  ok(Ember.isEmpty(authenticator._refreshTokenTimeout), 'Ember.SimpleAuth.Authenticators.OAuth2 does not schedule another refresh when the token expiration time is 5 seconds or less.');

  Ember.run(function() {
    authenticator.refreshAccessToken(10, 'refresh token!');
  });

  ok(!Ember.isEmpty(authenticator._refreshTokenTimeout), 'Ember.SimpleAuth.Authenticators.OAuth2 schedules another refresh when it successfully refreshed the access token.');
});
