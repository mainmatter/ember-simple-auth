var authorizer;

var xhrMock;
var XhrMock = Ember.Object.extend({
  init: function() {
    this.requestHeaders = {};
  },
  setRequestHeader: function(name, value) {
    this.requestHeaders[name] = value;
  }
});

module('Ember.SimpleAuth.Authorizers.OAuth2', {
  setup: function() {
    xhrMock    = XhrMock.create();
    authorizer = Ember.SimpleAuth.Authorizers.OAuth2.create({ session: Ember.SimpleAuth.Session.create() });
  },
  teardown: function() {
    Ember.run.cancel(Ember.SimpleAuth.Session._syncPropertiesTimeout);
  }
});

test('authorizes an AJAX request', function() {
  authorizer.set('session.authToken', undefined);
  authorizer.authorize(xhrMock, {});
  equal(xhrMock.requestHeaders['Authorization'], undefined, 'Ember.SimpleAuth.Authorizers.OAuth2 does not add the authToken to an AJAX request when the token is not empty.');

  var token = Math.random().toString(36);
  authorizer.set('session.authToken', token);
  authorizer.authorize(xhrMock, {});
  equal(xhrMock.requestHeaders['Authorization'], 'Bearer ' + token, 'Ember.SimpleAuth.Authorizers.OAuth2 adds the authToken to an AJAX request when the token is not empty.');
});
