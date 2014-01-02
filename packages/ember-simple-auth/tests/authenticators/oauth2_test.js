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

test('it restores the session', function() {
  var resolved;
  var resolvedWith;
  Ember.run(function() {
    authenticator.restore({ authToken: 'authToken', key: 'value' }).then(function(properties) {
      resolved     = true;
      resolvedWith = properties;
    });
  });

  ok(resolved, 'Ember.SimpleAuth.Authenticators.OAuth2 returns a resolving promise when the properties it restores from include an authToken.');
  deepEqual(resolvedWith, { authToken: 'authToken', key: 'value' }, 'Ember.SimpleAuth.Authenticators.OAuth2 returns a promise that resolves with the passed properties when the passed properties it restores from include an authToken.');

  var rejected;
  Ember.run(function() {
    authenticator.restore({}).then(function() {}, function() {
      rejected = true;
    });
  });

  ok(rejected, 'Ember.SimpleAuth.Authenticators.OAuth2 returns a rejecting promise when the properties it restores from do not include an authToken.');

  rejected = false;
  Ember.run(function() {
    authenticator.restore({ authToken: '' }).then(function() {}, function() {
      rejected = true;
    });
  });

  ok(rejected, 'Ember.SimpleAuth.Authenticators.OAuth2 returns a rejecting promise when the properties it restores from include an empty authToken.');
});

test('issues an AJAX request to authenticate', function() {
  Ember.run(function() {
    authenticator.authenticate({ identification: 'identification', password: 'password' });
  });

  equal(ajaxMock.requestOptions.url, '/token', 'Ember.SimpleAuth.Authenticators.OAuth2 sends a request to the serverTokenEndpoint to authenticate.');
  equal(ajaxMock.requestOptions.type, 'POST', 'Ember.SimpleAuth.Authenticators.OAuth2 sends a POST request to authenticate.');
  deepEqual(ajaxMock.requestOptions.data, { grant_type: 'password', password: 'password', username: 'identification' }, 'Ember.SimpleAuth.Authenticators.OAuth2 sends a request with the correct data to authenticate.');
  equal(ajaxMock.requestOptions.contentType, 'application/x-www-form-urlencoded', 'Ember.SimpleAuth.Authenticators.OAuth2 sends a request with the content type "application/x-www-form-urlencoded" to authenticate.');
});

test('returns a promise on authentication', function() {
  AjaxMock._resolve = { access_token: 'authToken' };
  var resolved;
  var resolvedWith;
  Ember.run(function() {
    authenticator.authenticate({}).then(function(properties) {
      resolved     = true;
      resolvedWith = properties;
    });
  });

  ok(resolved, 'Ember.SimpleAuth.Authenticators.OAuth2 returns a resolving promise on authentication when the AJAX request is successful.');
  deepEqual(resolvedWith, { authToken: 'authToken', authTokenExpiry: undefined, refreshToken: undefined }, 'Ember.SimpleAuth.Authenticators.OAuth2 returns a promise that resolves with authToken, authTokenExpiry and refreshToken on authentication when the AJAX request is successful.');

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

  ok(rejected, 'Ember.SimpleAuth.Authenticators.OAuth2 returns a rejecting promise on authentication when the AJAX request is not successful.');
  deepEqual(rejectedWith, 'error', 'Ember.SimpleAuth.Authenticators.OAuth2 returns a promise that rejects with the error message from the XHR response on authentication when the AJAX request is not successful.');
});

test('invalidates the session', function() {
  var resolved;
  Ember.run(function() {
    authenticator.invalidate().then(function(error) {
      resolved = true;
    });
  });

  ok(resolved, 'Ember.SimpleAuth.Authenticators.OAuth2 returns a resolving promise on invalidation.');
});

test('refreshes the auth token', function() {
  Ember.run(function() {
    authenticator.refreshAuthToken(1, 'refresh token!');
  });

  equal(ajaxMock.requestOptions.url, '/token', 'Ember.SimpleAuth.Authenticators.OAuth2 sends a request to the serverTokenEndpoint to refresh the auth token.');
  equal(ajaxMock.requestOptions.type, 'POST', 'Ember.SimpleAuth.Authenticators.OAuth2 sends a POST request to refresh the auth token.');
  deepEqual(ajaxMock.requestOptions.data, { grant_type: 'refresh_token', refresh_token: 'refresh token!' }, 'Ember.SimpleAuth.Authenticators.OAuth2 sends a request with the correct data to refresh the auth token.');
  equal(ajaxMock.requestOptions.contentType, 'application/x-www-form-urlencoded', 'Ember.SimpleAuth.Authenticators.OAuth2 sends a request with the content type "application/x-www-form-urlencoded" to refresh the auth token.');
});

test('keeps the token fresh', function() {
  AjaxMock._resolve = false;
  Ember.run(function() {
    authenticator.refreshAuthToken(1, 'refresh token!');
  });

  ok(Ember.isEmpty(authenticator._refreshTokenTimeout), 'Ember.SimpleAuth.Authenticators.OAuth2 does not schedule another refresh when refreshing the auth token failed.');

  AjaxMock._resolve = true;
  Ember.run(function() {
    authenticator.refreshAuthToken(5, 'refresh token!');
  });

  ok(Ember.isEmpty(authenticator._refreshTokenTimeout), 'Ember.SimpleAuth.Authenticators.OAuth2 does not schedule another refresh when the auth token expiration time is 5 seconds or less.');

  Ember.run(function() {
    authenticator.refreshAuthToken(10, 'refresh token!');
  });

  ok(!Ember.isEmpty(authenticator._refreshTokenTimeout), 'Ember.SimpleAuth.Authenticators.OAuth2 schedules another refresh when it successfully refreshed the auth token.');
});
