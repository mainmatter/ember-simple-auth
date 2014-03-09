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

module('Ember.SimpleAuth.Authenticators.Devise', {
  originalAjax: Ember.$.ajax,
  setup: function() {
    authenticator = Ember.SimpleAuth.Authenticators.Devise.create();
    ajaxMock      = AjaxMock.create();
    Ember.$.ajax  = Ember.$.proxy(ajaxMock.ajaxCapture, ajaxMock);
  },
  teardown: function() {
    Ember.run.cancel(authenticator._refreshTokenTimeout);
    Ember.$.ajax = this.originalAjax;
  }
});

test('restores the session', function() {
  var rejected;
  Ember.run(function() {
    authenticator.restore({}).then(function() {}, function() {
      rejected = true;
    });
  });

  ok(rejected, 'Ember.SimpleAuth.Authenticators.Devise returns a rejecting promise when the properties it restores the session from do not include a remember_token.');

  rejected = false;
  Ember.run(function() {
    authenticator.restore({ remember_token: '' }).then(function() {}, function() {
      rejected = true;
    });
  });

  ok(rejected, 'Ember.SimpleAuth.Authenticators.Devise returns a rejecting promise when the properties it restores the session from include an empty remember_token.');
});

test('issues an AJAX request for authentication', function() {
  Ember.run(function() {
    authenticator.authenticate({ identification: 'identification', password: 'password', remember_me: false });
  });

  equal(ajaxMock.requestOptions.url, '/users/sign_in', 'Ember.SimpleAuth.Authenticators.Devise sends a request to the serverTokenEndpoint for authentication.');
  equal(ajaxMock.requestOptions.type, 'POST', 'Ember.SimpleAuth.Authenticators.Devise sends a POST request for authentication.');
  deepEqual(ajaxMock.requestOptions.data, { password: 'password', email: 'identification', remember_me: false }, 'Ember.SimpleAuth.Authenticators.Devise sends a request with the correct data for authentication.');
  equal(ajaxMock.requestOptions.dataType, 'json', 'Ember.SimpleAuth.Authenticators.Devise sends a request with the data type "json" for authentication.');
  equal(ajaxMock.requestOptions.contentType, 'application/x-www-form-urlencoded', 'Ember.SimpleAuth.Authenticators.Devise sends a request with the content type "application/x-www-form-urlencoded" for authentication.');
});

test('returns a promise on authentication', function() {
  AjaxMock._resolve = { access_token: 'access_token', remember_token: 'remember_token' };
  var resolved;
  var resolvedWith;
  Ember.run(function() {
    authenticator.authenticate({}).then(function(properties) {
      resolved     = true;
      resolvedWith = properties;
    });
  });

  ok(resolved, 'Ember.SimpleAuth.Authenticators.Devise returns a resolving promise when the authentication AJAX request is successful.');
  deepEqual(resolvedWith, { access_token: 'access_token', remember_token: 'remember_token' }, "Ember.SimpleAuth.Authenticators.Devise returns a promise that resolves with the server's response when the authentication AJAX request is successful.");

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

  ok(rejected, 'Ember.SimpleAuth.Authenticators.Devise returns a rejecting promise when the authentication AJAX request is not successful.');
  deepEqual(rejectedWith, 'error', 'Ember.SimpleAuth.Authenticators.Devise returns a promise that rejects with the error message from the response when the authentication AJAX request is not successful.');
});

test('invalidates the session', function() {
  var resolved;
  Ember.run(function() {
    authenticator.invalidate().then(function(error) {
      resolved = true;
    });
  });

  ok(resolved, 'Ember.SimpleAuth.Authenticators.Devise returns a resolving promise for session invalidation.');
});