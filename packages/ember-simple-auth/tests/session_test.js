var session;

function mockPromise(resolveWith, rejectWith) {
  return new Ember.RSVP.Promise(function(resolve, reject) {
    if (!Ember.isEmpty(resolveWith) && !!resolveWith) {
      resolve(resolveWith);
    } else {
      reject.call(null, rejectWith);
    }
  });
}

var storeMock;
var StoreMock = Ember.SimpleAuth.Stores.Ephemeral.extend({
  loadAll: function() {
    this.loadAllInvoked = true;
    return this._super();
  }
});

var authenticatorMock;
var AuthenticatorMock = Ember.Object.extend(Ember.Evented, {
  restore: function(content) {
    return mockPromise(AuthenticatorMock._resolve);
  },
  authenticate: function(options) {
    this.authenticateInvoked     = true;
    this.authenticateInvokedWith = options;
    return mockPromise(AuthenticatorMock._resolve, AuthenticatorMock._reject);
  },
  unauthenticate: function() {
    this.unauthenticateInvoked = true;
    return mockPromise(AuthenticatorMock._resolve);
  }
});

module('Ember.SimpleAuth.Session', {
  setup: function() {
    window.AuthenticatorMock = AuthenticatorMock;
    authenticatorMock        = AuthenticatorMock.create();
    storeMock                = StoreMock.create();
    Ember.run(function() {
      session = Ember.SimpleAuth.Session.create({ authenticator: authenticatorMock, store: storeMock });
    });
  },
  teardown: function() {
    delete window.AuthenticatorMock;
    delete window.Authenticators;
    delete AuthenticatorMock._resolve;
    delete AuthenticatorMock._reject;
  }
});

test('is not authenticated when just created', function() {
  session = Ember.SimpleAuth.Session.create({ store: storeMock });

  ok(!session.get('isAuthenticated'), 'Ember.Session is not authenticated when just created.');
});

test('restores its state during initialization', function() {
  storeMock.save({ authenticator: 'AuthenticatorMock' });
  AuthenticatorMock._resolve = { some: 'content' };
  Ember.run(function() {
    session = Ember.SimpleAuth.Session.create({ store: storeMock });
  });

  ok(storeMock.loadAllInvoked, 'Ember.Session restores its content from the store during initialization.');
  ok(session.get('authenticator') instanceof AuthenticatorMock, 'Ember.Session restores the authenticator as a new instance of the class read from the store during initialization.');
  ok(session.get('isAuthenticated'), 'Ember.Session is authenticated when the restored authenticator resolves during initialization.');
  deepEqual(session.get('content'), { some: 'content' }, 'Ember.Session sets its content when the restored authenticator resolves during initialization.');

  AuthenticatorMock._resolve = false;
  storeMock.save({ key1: 'value1', key2: 'value2' });
  Ember.run(function() {
    session = Ember.SimpleAuth.Session.create({ store: storeMock });
  });

  equal(session.get('authenticator'), null, 'Ember.Session does not assign the authenticator during initialization when the authenticator rejects.');
  ok(!session.get('isAuthenticated'), 'Ember.Session is not authenticated when the restored authenticator rejects during initialization.');
  equal(session.get('content'), null, 'Ember.Session does not set its content when the restored authenticator rejects during initialization.');
  equal(storeMock.loadAll().key1, null, 'Ember.Session clears the store when the restored authenticator rejects during initialization.');
  equal(storeMock.loadAll().key2, null, 'Ember.Session clears the store when the restored authenticator rejects during initialization.');
});

test('authenticates itself with an authenticator', function() {
  var resolved;
  AuthenticatorMock._resolve = { key: 'value' };
  Ember.run(function() {
    session.authenticate(authenticatorMock).then(function() {
      resolved = true;
    });
  });

  ok(authenticatorMock.authenticateInvoked, 'Ember.Session authenticates with the passed authenticator on setup.');
  ok(session.get('isAuthenticated'), 'Ember.Session is authenticated after setup when the authenticator resolves.');
  equal(session.get('key'), 'value', 'Ember.Session sets all properties that the authenticator resolves with during setup.');
  equal(session.get('authenticator'), authenticatorMock, 'Ember.Session saves the authenticator during setup when the authenticator resolves.');
  ok(resolved, 'Ember.Session returns a resolving promise on setup when the authenticator resolves.');

  var rejected;
  var rejectedWith;
  AuthenticatorMock._resolve = false;
  AuthenticatorMock._reject = { error: 'message' };
  Ember.run(function() {
    session = Ember.SimpleAuth.Session.create({ store: storeMock });
    session.authenticate(authenticatorMock).then(function() {}, function(error) {
      rejected     = true;
      rejectedWith = error;
    });
  });

  ok(!session.get('isAuthenticated'), 'Ember.Session is not authenticated after setup when the authenticator rejects.');
  equal(session.get('authenticator'), null, 'Ember.Session does not save the authenticator during setup when the authenticator rejects.');
  ok(rejected, 'Ember.Session returns a rejecting promise on setup when the authenticator rejects.');
  deepEqual(rejectedWith, { error: 'message'}, 'Ember.Session returns a promise that rejects with the error from the authenticator on setup when the authenticator rejects.');
});

test('unauthenticates itself', function() {
  AuthenticatorMock._resolve = true;
  Ember.run(function() {
    session.authenticate(authenticatorMock);
  });
  AuthenticatorMock._resolve = false;
  AuthenticatorMock._reject = { error: 'message' };
  session.set('isAuthenticated', true);
  Ember.run(function() {
    session.unauthenticate();
  });

  ok(session.get('isAuthenticated'), 'Ember.Session remains authenticated after unauthentication when the authenticator rejects.');
  equal(session.get('authenticator'), authenticatorMock, 'Ember.Session does not unset the authenticator after unauthentication when the authenticator rejects.');

  AuthenticatorMock._resolve = true;
  Ember.run(function() {
    session.unauthenticate();
  });

  ok(authenticatorMock.unauthenticateInvoked, 'Ember.Session unauthenticates with the authenticator on destruction.');
  ok(!session.get('isAuthenticated'), 'Ember.Session is not authenticated after unauthentication when the authenticator resolves.');
  equal(session.get('aurhenticator'), null, 'Ember.Session unsets the authenticator after unauthentication when the authenticator resolves.');
  equal(session.get('content'), null, 'Ember.Session unsets its content object after unauthentication when the authenticator resolves.');

  Ember.run(function() {
    authenticatorMock.trigger('updated_session_data', { key: 'other value' });
  });

  equal(session.get('key'), null, 'Ember.Session stops listening to the "updated_session_data" of the authenticator after unauthentication when the authenticator resolves.');
});

test('observes changes of the observer', function() {
  window.Authenticators                        = Ember.Namespace.create();
  window.Authenticators.OtherAuthenticatorMock = AuthenticatorMock.extend();
  var otherAuthenticatorMock                   = window.Authenticators.OtherAuthenticatorMock.create();
  Ember.run(function() {
    session.set('authenticator', otherAuthenticatorMock);
    otherAuthenticatorMock.trigger('updated_session_data', { key: 'value' });
  });

  equal(session.get('key'), 'value', 'Ember.Session subscribes to the "updated_session_data" of the authenticator when it is assigned.');
  equal(storeMock.loadAll().authenticator, 'Authenticators.OtherAuthenticatorMock', "Ember.Session saves the authenticator's prototype to the store when it is assigned.");
});
