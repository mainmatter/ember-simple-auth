module('Ember.SimpleAuth.Session');

test('reads the authToken from the session storage during initialization', function() {
  var token = Math.random().toString(36);
  sessionStorage.authToken = token;
  var session = Ember.SimpleAuth.Session.create();

  equal(session.get('authToken'), token, 'Ember.SimpleAuth.Session reads authToken from sessionStorage during initialization.');
});

test('persists the authToken to the session storage when it changes', function() {
  var session = Ember.SimpleAuth.Session.create();
  var token = Math.random().toString(36);
  session.set('authToken', token);

  equal(sessionStorage.authToken, token, 'Ember.SimpleAuth.Session persists authToken to sessionStorage when it changes.');
});

test('deletes the auth token from the session storage when it becomes empty', function() {
  var session = Ember.SimpleAuth.Session.create();
  session.set('authToken', 'some token');
  session.set('authToken', undefined);

  equal(sessionStorage.authToken, undefined, 'Ember.SimpleAuth.Session deletes authToken from sessionStorage when it becomes empty.');
});

test('assigns the auth token correctly during setup', function() {
  var session = Ember.SimpleAuth.Session.create();
  var token = Math.random().toString(36);
  session.setup({ access_token: token });

  equal(session.get('authToken'), token, 'Ember.SimpleAuth.Session assigns authToken correctly during setup.');

  session.setup({});

  equal(session.get('authToken'), undefined, 'Ember.SimpleAuth.Session assigns authToken as undefined during setup when the supplied session is empty.');

  session.setup(null);

  equal(session.get('authToken'), undefined, 'Ember.SimpleAuth.Session assigns authToken as undefined during setup when the supplied session is null.');
});

test('clears the auth token during destruction', function() {
  var session = Ember.SimpleAuth.Session.create();
  session.set('authToken', 'some Token');
  session.destroy();

  equal(session.get('authToken'), undefined, 'Ember.SimpleAuth.Session clears authToken during destruction.');
});

test('is authenticated when the auth token is present, otherwise not', function() {
  var session = Ember.SimpleAuth.Session.create();
  session.set('authToken', Math.random().toString(36));

  ok(session.get('isAuthenticated'), 'Ember.SimpleAuth.Session is authenticated when authToken is present.');

  session.set('authToken', '');
  ok(!session.get('isAuthenticated'), 'Ember.SimpleAuth.Session is not authenticated when authToken is empty.');

  session.set('authToken', null);
  ok(!session.get('isAuthenticated'), 'Ember.SimpleAuth.Session is not authenticated when authToken is null.');

  session.set('authToken', undefined);
  ok(!session.get('isAuthenticated'), 'Ember.SimpleAuth.Session is not authenticated when authToken is undefined.');
});
