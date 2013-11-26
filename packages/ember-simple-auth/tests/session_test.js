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

var authenticatorMock;
var AuthenticatorMock = Ember.Object.extend(Ember.Evented, {
  restore: function() {
    this.restoreInvoked = true;
    return mockPromise(this.get('resolveRestoreWith'));
  },
  authenticate: function(options) {
    this.authenticateInvoked     = true;
    this.authenticateInvokedWith = options;
    return mockPromise(this.get('resolveAuthenticateWith'), this.get('rejectAuthenticateWith'));
  },
  unauthenticate: function() {
    this.unauthenticateInvoked = true;
    return mockPromise(this.get('resolveUnauthenticateWith'));
  },
  remember: function() {
    this.rememberInvoked = true;
  },
  forget: function() {
    this.forgetInvoked = true;
  }
});

module('Ember.SimpleAuth.Session', {
  setup: function() {
    authenticatorMock = AuthenticatorMock.create();
    Ember.run(function() {
      session = Ember.SimpleAuth.Session.create({ authenticator: authenticatorMock });
    })
  }
});

test('is not authenticated when just created', function() {
  session = Ember.SimpleAuth.Session.create();

  ok(!session.get('isAuthenticated'), 'Ember.Session is not authenticated when just created.');
});

test('restores its previus state during initialization', function() {
  Ember.run(function() {
    session = Ember.SimpleAuth.Session.create({ authenticator: authenticatorMock });
  });

  ok(authenticatorMock.restoreInvoked, 'Ember.Session restores its previous during initialization when the authenticator is set.');

  Ember.run(function() {
    var resolvingAuthenticatorMock = AuthenticatorMock.create({ resolveRestoreWith: { key: 'value' } });
    session = Ember.SimpleAuth.Session.create({ authenticator: resolvingAuthenticatorMock });
  });

  ok(session.get('isAuthenticated'), 'Ember.Session is authenticated after initialization when the restore through the authenticator resolves.');
  equal(session.get('key'), 'value', 'Ember.Session sets all properties that the authenticator resolves with during initialization.');
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
  ok(resolvingAuthenticatorMock.forgetInvoked, 'Ember.Session forgets the authenticator on destruction when the authenticator resolves.');
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

  ok(!authenticatorMock.forgetInvoked, 'Ember.Session does not forget the authenticator on destruction when the authenticator rejects.');
  ok(session.get('isAuthenticated'), 'Ember.Session remains authenticated after destruction when the authenticator rejects.');
  equal(session.get('authenticator'), authenticatorMock, 'Ember.Session does not unset the authenticator after destruction when the authenticator rejects.');
});

test('observes changes of the observer', function() {
  var otherAuthenticatorMock = AuthenticatorMock.create();
  session.set('authenticator', otherAuthenticatorMock);
  otherAuthenticatorMock.trigger('updated_session_data', { key: 'value' })

  ok(otherAuthenticatorMock.rememberInvoked, 'Ember.Session remembers the authenticator when it is assigned.');
  equal(session.get('key'), 'value', 'Ember.Session subscribes to the "updated_session_data" of the authenticator when it is assigned.');
});
