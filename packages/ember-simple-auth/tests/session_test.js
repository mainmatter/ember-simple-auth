var get = Ember.get, set = Ember.set, _$;

module('SimpleAuth.Session');

test('exists', function() {
  ok(Ember.Object.detect(Ember.SimpleAuth.Session), 'Ember.SimpleAuth.Session is an Ember.Object');
});

test('persists the authToken to the sessionStorage when it changes', function() {
  var session = Ember.SimpleAuth.Session.create();
  var token = Math.random().toString(36);
  session.set('authToken', token);
  ok(sessionStorage.authToken === token, 'Ember.SimpleAuth.Session persists the authToken in the sessionStorage');
});
