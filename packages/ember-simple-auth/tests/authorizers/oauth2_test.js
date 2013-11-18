var oauth2;

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
  originalAjaxPrefilter: Ember.$.ajaxPrefilter,
  setup: function() {
    xhrMock = XhrMock.create();
    oauth2  = Ember.SimpleAuth.Authorizers.OAuth2.create({ session: Ember.SimpleAuth.Session.create() });
  },
  teardown: function() {
    Ember.run.cancel(Ember.SimpleAuth.Session._syncPropertiesTimeout);
  }
});

test('authorizes an AJAX request', function() {
  oauth2.set('session.authToken', undefined);
  oauth2.authorize(xhrMock, {});
  equal(xhrMock.requestHeaders['Authorization'], undefined, 'Ember.SimpleAuth.Authorizers.OAuth2 does not add the authToken to an AJAX request when the token is not empty.');

  var token = Math.random().toString(36);
  oauth2.set('session.authToken', token);
  oauth2.authorize(xhrMock, {});
  equal(xhrMock.requestHeaders['Authorization'], 'Bearer ' + token, 'Ember.SimpleAuth.Authorizers.OAuth2 adds the authToken to an AJAX request when the token is not empty.');
});
