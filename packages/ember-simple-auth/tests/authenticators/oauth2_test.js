var authenticator;

var ajaxMock;
var AjaxMock = Ember.Object.extend({
  response:    { access_token: 'authToken' },
  ajaxCapture: function(options) {
    var _this           = this;
    this.requestOptions = options;
    return {
      then: function(success, fail) {
        if (!!success) {
          success(_this.response);
        }
        if (!!fail) {
          fail('xhr', 'status', 'error');
        }
      }
    };
  }
});

module('Ember.SimpleAuth.Authenticators.OAuth2', {
  originalAjax: Ember.$.ajax,
  setup: function() {
    authenticator = Ember.SimpleAuth.Authenticators.OAuth2.create()
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
  deepEqual(resolvedWith, { authToken: 'authToken', key: 'value' }, 'Ember.SimpleAuth.Authenticators.OAuth2 returns a promise that resolves with the passed properties when the properties include an authToken on restore.')

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

  authenticator.setProperties({
    clientId:     'clientId',
    clientSecret: 'clientSecret'
  });
  Ember.run(function() {
    authenticator.authenticate({ identification: 'identification', password: 'password' });
  });

  equal(ajaxMock.requestOptions.data, 'grant_type=password&username=identification&password=password&client_id=clientId&client_secret=clientSecret', 'Ember.SimpleAuth.Authenticators.OAuth2 sends a request with client_id and client_secret on authentication when these are set.');
});
