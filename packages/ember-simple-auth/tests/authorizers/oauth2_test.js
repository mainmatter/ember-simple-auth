var authorizer;

var sessionMock;

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
    xhrMock     = XhrMock.create();
    sessionMock = Ember.Object.create();
    authorizer  = Ember.SimpleAuth.Authorizers.OAuth2.create({ session: sessionMock });
  }
});

test('authorizes an AJAX request', function() {
  authorizer.set('session.access_token', null);
  authorizer.authorize(xhrMock, {});
  equal(xhrMock.requestHeaders['Authorization'], null, 'Ember.SimpleAuth.Authorizers.OAuth2 does not add the access_token to an AJAX request when the token is empty.');

  var token = Math.random().toString(36);
  authorizer.set('session.access_token', token);
  authorizer.authorize(xhrMock, {});
  equal(xhrMock.requestHeaders['Authorization'], 'Bearer ' + token, 'Ember.SimpleAuth.Authorizers.OAuth2 adds the access_token to an AJAX request when the token is not empty.');
});
