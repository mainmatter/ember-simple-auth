var session;

function mockPromise(resolveWith, rejectWith) {
  return new Ember.RSVP.Promise(function(resolve, reject) {
    if (!Ember.isEmpty(resolveWith)) {
      resolve(resolveWith);
    } else {
      reject.call(undefined, rejectWith);
    }
  });
}

var storeMock;
var StoreMock = Ember.SimpleAuth.Stores.Ephemeral.extend({
  restore: function() {
    this.restoreInvoked = true;
    return {};
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
    return mockPromise(this.get('resolveAuthenticateWith'), this.get('rejectAuthenticateWith'));
  },
  unauthenticate: function() {
    this.unauthenticateInvoked = true;
    return mockPromise(this.get('resolveUnauthenticateWith'));
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
    delete AuthenticatorMock._resolveWith;
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

  ok(storeMock.restoreInvoked, 'Ember.Session restores its content from the store during initialization.');
  ok(session.get('authenticator') instanceof AuthenticatorMock, 'Ember.Session restores the authenticator as a new instance of the class read from the store during initialization.');
  ok(session.get('isAuthenticated'), 'Ember.Session is authenticated when the restored authenticator resolves during initialization.');
  deepEqual(session.get('content'), { some: 'content' }, 'Ember.Session sets its content when the restored authenticator resolves during initialization.');

  AuthenticatorMock._resolve = false;
  storeMock.save({ key1: 'value1', key2: 'value2' });
  Ember.run(function() {
    session = Ember.SimpleAuth.Session.create({ store: storeMock });
  });

  equal(session.get('authenticator'), undefined, 'Ember.Session does not assign the authenticator during initialization when the authenticator rejects.');
  ok(!session.get('isAuthenticated'), 'Ember.Session is not authenticated when the restored authenticator rejects during initialization.');
  equal(session.get('content'), undefined, 'Ember.Session does not set its content when the restored authenticator rejects during initialization.');
  equal(storeMock.load('key1'), undefined, 'Ember.Session clears the store when the restored authenticator rejects during initialization.');
  equal(storeMock.load('key2'), undefined, 'Ember.Session clears the store when the restored authenticator rejects during initialization.');
});

test('sets itself up with an authenticator', function() {
  var resolved;
  var resolvingAuthenticatorMock = AuthenticatorMock.create({ resolveAuthenticateWith: { key: 'value' } });
  Ember.run(function() {
    session.setup(resolvingAuthenticatorMock).then(function() {
      resolved = true;
    });
  });

  ok(resolvingAuthenticatorMock.authenticateInvoked, 'Ember.Session authenticates with the passed authenticator on setup.');
  ok(session.get('isAuthenticated'), 'Ember.Session is authenticated after setup when the authenticator resolves.');
  equal(session.get('key'), 'value', 'Ember.Session sets all properties that the authenticator resolves with during setup.');
  equal(session.get('authenticator'), resolvingAuthenticatorMock, 'Ember.Session saves the authenticator during setup when the authenticator resolves.');
  ok(resolved, 'Ember.Session returns a resolving promise on setup when the authenticator resolves.');

  var rejected;
  var rejectedWith;
  var rejectingAuthenticatorMock = AuthenticatorMock.create({ rejectAuthenticateWith: [{ key: 'other value' }, { error: 'message' }] });
  Ember.run(function() {
    session.setup(rejectingAuthenticatorMock).then(function() {}, function(error) {
      rejected     = true;
      rejectedWith = error;
    });
  });

  ok(!session.get('isAuthenticated'), 'Ember.Session is not authenticated after setup when the authenticator rejects.');
  equal(session.get('key'), 'other value', 'Ember.Session sets all properties that the authenticator rejects with during setup.');
  equal(session.get('authenticator'), undefined, 'Ember.Session does not save the authenticator during setup when the authenticator rejects.');
  ok(rejected, 'Ember.Session returns a rejecting promise on setup when the authenticator rejects.');
  deepEqual(rejectedWith, { error: 'message'}, 'Ember.Session returns a promise that rejects with the error from the authenticator on setup when the authenticator rejects.');
});

test('destroys itself', function() {
  var resolvingAuthenticatorMock = AuthenticatorMock.create({ resolveUnauthenticateWith: { key: 'value' } });
  session.set('authenticator', resolvingAuthenticatorMock);
  Ember.run(function() {
    session.destroy();
  });

  ok(resolvingAuthenticatorMock.unauthenticateInvoked, 'Ember.Session unauthenticates with the passed authenticator on destruction.');
  ok(!session.get('isAuthenticated'), 'Ember.Session is not authenticated after destruction when the authenticator resolves.');
  equal(session.get('aurhenticator'), undefined, 'Ember.Session unsets the authenticator after destruction when the authenticator resolves.');
  equal(session.get('key'), 'value', 'Ember.Session sets all properties that the authenticator resolves with on destruction.');

  Ember.run(function() {
    resolvingAuthenticatorMock.trigger('updated_session_data', { key: 'other value' })
  });

  equal(session.get('key'), 'value', 'Ember.Session stops listening to the "updated_session_data" of the authenticator on destruction when the authenticator resolves.');

  session.set('authenticator', authenticatorMock);
  session.set('isAuthenticated', true);
  session.set('key', undefined);
  Ember.run(function() {
    session.destroy();
  })

  ok(session.get('isAuthenticated'), 'Ember.Session remains authenticated after destruction when the authenticator rejects.');
  equal(session.get('authenticator'), authenticatorMock, 'Ember.Session does not unset the authenticator after destruction when the authenticator rejects.');
});

test('observes changes of the observer', function() {
  var otherAuthenticatorMock = AuthenticatorMock.create();
  session.set('authenticator', otherAuthenticatorMock);
  otherAuthenticatorMock.trigger('updated_session_data', { key: 'value' })

  equal(session.get('key'), 'value', 'Ember.Session subscribes to the "updated_session_data" of the authenticator when it is assigned.');
});
