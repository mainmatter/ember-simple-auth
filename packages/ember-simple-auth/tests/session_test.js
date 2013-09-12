module('Ember.SimpleAuth.Session');

test('reads the authToken from sessionStorage when it is initialized', function() {
  var token = Math.random().toString(36);
  sessionStorage.authToken = token;
  var session = Ember.SimpleAuth.Session.create();

  equal(session.get('authToken'), token, 'Ember.SimpleAuth.Session reads the authToken from sessionStorage when initialized.');
});

test('persists the authToken to the sessionStorage when it changes', function() {
  var session = Ember.SimpleAuth.Session.create();
  var token = Math.random().toString(36);
  session.set('authToken', token);

  equal(sessionStorage.authToken, token, 'Ember.SimpleAuth.Session persists the authToken in the sessionStorage.');
});

test('deletes the authToken from sessionStorage when it changes to empty', function() {
  var session = Ember.SimpleAuth.Session.create();
  session.set('authToken', 'some token');
  session.set('authToken', undefined);

  equal(sessionStorage.authToken, undefined, 'Ember.SimpleAuth.Session deletes the authToken from the sessionStorage when it changes ti empty.');
});

test('sets up the authToken correctly', function() {
  var session = Ember.SimpleAuth.Session.create();
  var token = Math.random().toString(36);
  session.setup({ session: { authToken: token }});

  equal(session.get('authToken'), token, 'Ember.SimpleAuth.Session sets up the authToken correctly.');

  session.setup({});

  equal(session.get('authToken'), undefined, 'Ember.SimpleAuth.Session sets up the authToken correctly with an empty server session.');
});

test('clears the authToken when destroyed', function() {
  var session = Ember.SimpleAuth.Session.create();
  session.set('authToken', 'some Token');
  session.destroy();

  equal(session.get('authToken'), undefined, 'Ember.SimpleAuth.Session clears the authToken on logout.');
});

test('is authenticated when the authToken is present, otherwise not', function() {
  var session = Ember.SimpleAuth.Session.create();
  session.set('authToken', Math.random().toString(36));

  ok(session.get('isAuthenticated'), 'Ember.SimpleAuth.Session is authenticated when the authToken is present.');

  session.set('authToken', '');
  ok(!session.get('isAuthenticated'), 'Ember.SimpleAuth.Session is not authenticated when the authToken is empty.');
});
