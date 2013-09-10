module('Ember.SimpleAuth.Session');

test('reads the authToken from sessionStorage when it is initialized', function() {
  var token = Math.random().toString(36);
  sessionStorage.authToken = token;
  var session = Ember.SimpleAuth.Session.create();

  equal(session.get('authToken'), token, 'Ember.SimpleAuth.Session reads the authToken from sessionStorage when initialized');
});

test('persists the authToken to the sessionStorage when it changes', function() {
  var session = Ember.SimpleAuth.Session.create();
  var token = Math.random().toString(36);
  session.set('authToken', token);

  equal(sessionStorage.authToken, token, 'Ember.SimpleAuth.Session persists the authToken in the sessionStorage');
});

test('is authenticated when the authToken is present, otherwise not', function() {
  var session = Ember.SimpleAuth.Session.create();
  session.set('authToken', Math.random().toString(36));

  ok(session.get('isAuthenticated'), 'Ember.SimpleAuth.Session is authenticated when the authToken is present');

  session.set('authToken', '');
  ok(!session.get('isAuthenticated'), 'Ember.SimpleAuth.Session is not authenticated when the authToken is empty');
});
