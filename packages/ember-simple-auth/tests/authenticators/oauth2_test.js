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

  ok(resolved, 'Ember.SimpleAuth.Authenticators.OAuth2 returns a resolving promise when the properties include an authToken on restore.');
  deepEqual(resolvedWith, { authToken: 'authToken', key: 'value' }, 'Ember.SimpleAuth.Authenticators.OAuth2 returns a promise that resolves with the passed properties when the properties include an authToken on restore.');

  var rejected;
  Ember.run(function() {
    authenticator.restore({}).then(function() { }, function() {
      rejected = true;
    });
  });

  ok(rejected, 'Ember.SimpleAuth.Authenticators.OAuth2 returns a rejecting promise when the properties do not include an authToken on restore.');

  rejected = false;
  Ember.run(function() {
    authenticator.restore({ authToken: '' }).then(function() { }, function() {
      rejected = true;
    });
  });

  ok(rejected, 'Ember.SimpleAuth.Authenticators.OAuth2 returns a rejecting promise when the properties include an empty authToken on restore.');
});

test('sends a request to the server token route on authentication', function() {
  Ember.run(function() {
    authenticator.authenticate({ identification: 'identification', password: 'password' });
  });

  equal(ajaxMock.requestOptions.url, '/token', 'Ember.SimpleAuth.Authenticators.OAuth2 sends a request to the serverTokenEndpoint on authentication.');
  equal(ajaxMock.requestOptions.type, 'POST', 'Ember.SimpleAuth.Authenticators.OAuth2 sends a POST request on authentication.');
  equal(ajaxMock.requestOptions.data, 'grant_type=password&username=identification&password=password', 'Ember.SimpleAuth.Authenticators.OAuth2 sends a request with the correct data on authentication.');
  equal(ajaxMock.requestOptions.contentType, 'application/x-www-form-urlencoded', 'Ember.SimpleAuth.Authenticators.OAuth2 sends a request with the content type "application/x-www-form-urlencoded" on authentication.');

  Ember.SimpleAuth.Authenticators.OAuth2.cliendId     = 'clientId';
  Ember.SimpleAuth.Authenticators.OAuth2.cliendSecret = 'clientSecret';
  Ember.run(function() {
    authenticator.authenticate({ identification: 'identification', password: 'password' });
  });
  Ember.SimpleAuth.Authenticators.OAuth2.cliendId     = null;
  Ember.SimpleAuth.Authenticators.OAuth2.cliendSecret = null;

  equal(ajaxMock.requestOptions.data, 'grant_type=password&username=identification&password=password&client_id=clientId&client_secret=clientSecret', 'Ember.SimpleAuth.Authenticators.OAuth2 sends a request with client_id and client_secret on authentication when these are set.');
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

test('invaldiates the session', function() {
  var resolved;
  Ember.run(function() {
    authenticator.invaldiate().then(function(error) {
      resolved = true;
    });
  });

  ok(resolved, 'Ember.SimpleAuth.Authenticators.OAuth2 returns a resolving promise on unauthentication.');
});
