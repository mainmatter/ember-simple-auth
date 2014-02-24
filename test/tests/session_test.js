import { Session } from 'ember-simple-auth/session';
import { Ephemeral } from 'ember-simple-auth/stores/ephemeral';

var session;

function mockPromise(resolveWith, rejectWith) {
  return new Ember.RSVP.Promise(function(resolve, reject) {
    if (!Ember.isEmpty(resolveWith) && !!resolveWith) {
      resolve(resolveWith);
    } else {
      reject(rejectWith);
    }
  });
}

var containerMock;
var ContainerMock = Ember.Object.extend({
  lookup: function(name) {
    this.lookupInvoked     = true;
    this.lookupInvokedWith = name;
    return ContainerMock._lookup;
  }
});

var storeMock;
var StoreMock = Ephemeral.extend({
  restore: function() {
    this.restoreInvoked = true;
    return this._super();
  }
});

var authenticatorMock;
var AuthenticatorMock = Ember.Object.extend(Ember.Evented, {
  restore: function(content) {
    return mockPromise(AuthenticatorMock._resolve);
  },
  authenticate: function(properties) {
    this.authenticateInvoked     = true;
    this.authenticateInvokedWith = properties;
    return mockPromise(AuthenticatorMock._resolve, AuthenticatorMock._reject);
  },
  invalidate: function(properties) {
    this.invalidateInvoked     = true;
    this.invalidateInvokedWith = properties;
    return mockPromise(AuthenticatorMock._resolve);
  }
});

module('Session', {
  setup: function() {
    authenticatorMock     = AuthenticatorMock.create();
    storeMock             = StoreMock.create();
    containerMock         = ContainerMock.create();
    ContainerMock._lookup = authenticatorMock;
    Ember.run(function() {
      session = Session.create({ store: storeMock, container: containerMock });
    });
  }
});

test('it is not authenticated when just created', function() {
  session = Session.create({ store: storeMock, container: containerMock });

  ok(!session.get('isAuthenticated'), 'Session is not authenticated when just created.');
});

test('restores its state during initialization', function() {
  storeMock.persist({ authenticatorFactory: 'authenticators:test' });
  AuthenticatorMock._resolve = { some: 'content' };
  Ember.run(function() {
    session = Session.create({ store: storeMock, container: containerMock });
  });

  ok(storeMock.restoreInvoked, 'Session restores its content from the store during initialization.');
  ok(containerMock.lookupInvoked, 'Session restores the authenticator type from the contaniner.');
  deepEqual(containerMock.lookupInvokedWith, 'authenticators:test', 'Session restores the authenticator from the container with the key read from the store.');
  deepEqual(session.get('authenticatorFactory'), 'authenticators:test', 'Session restores the authenticator type.');
  ok(session.get('isAuthenticated'), 'Session is authenticated when the restored authenticator resolves during initialization.');
  deepEqual(session.get('content'), { some: 'content' }, 'Session sets its content when the restored authenticator resolves during initialization.');

  AuthenticatorMock._resolve = false;
  storeMock.persist({ key1: 'value1' });
  Ember.run(function() {
    session = Session.create({ store: storeMock, container: containerMock });
  });

  equal(session.get('authenticatorFactory'), null, 'Session does not assign the authenticator during initialization when the authenticator rejects.');
  ok(!session.get('isAuthenticated'), 'Session is not authenticated when the restored authenticator rejects during initialization.');
  equal(session.get('content'), null, 'Session does not set its content when the restored authenticator rejects during initialization.');
  equal(storeMock.restore().key1, null, 'Session clears the store when the restored authenticator rejects during initialization.');
});

test('authenticates itself with an authenticator', function() {
  var resolved;
  AuthenticatorMock._resolve = { key: 'value' };
  Ember.run(function() {
    session.authenticate('authenticators:test').then(function() {
      resolved = true;
    });
  });

  ok(authenticatorMock.authenticateInvoked, 'Session authenticates itself with the passed authenticator.');
  ok(session.get('isAuthenticated'), 'Session is authenticated when the authenticator resolves.');
  equal(session.get('key'), 'value', 'Session saves all properties that the authenticator resolves with.');
  equal(session.get('authenticatorFactory'), 'authenticators:test', 'Session saves the authenticator type when the authenticator resolves.');
  ok(resolved, 'Session returns a resolving promise when the authenticator resolves.');

  var rejected;
  var rejectedWith;
  AuthenticatorMock._resolve = false;
  AuthenticatorMock._reject = { error: 'message' };
  Ember.run(function() {
    session = Session.create({ store: storeMock, container: containerMock });
    session.authenticate(authenticatorMock).then(function() {}, function(error) {
      rejected     = true;
      rejectedWith = error;
    });
  });

  ok(!session.get('isAuthenticated'), 'Session is not authenticated when the authenticator rejects.');
  equal(session.get('authenticatorFactory'), null, 'Session does not save the authenticator type when the authenticator rejects.');
  ok(rejected, 'Session returns a rejecting promise when the authenticator rejects.');
  deepEqual(rejectedWith, { error: 'message'}, 'Session returns a promise that rejects with the error that the authenticator rejects with.');
});

test('invalidates itself', function() {
  AuthenticatorMock._resolve = false;
  AuthenticatorMock._reject = { error: 'message' };
  session.set('isAuthenticated', true);
  Ember.run(function() {
    session.set('authenticatorFactory', 'authenticators:test');
    session.set('content', { key: 'value' });
    session.invalidate();
  });

  ok(authenticatorMock.invalidateInvoked, 'Session invalidates with the passed authenticator.');
  deepEqual(authenticatorMock.invalidateInvokedWith, { key: 'value' }, 'Session passes its content to the authenticator to invalidation.');
  ok(session.get('isAuthenticated'), 'Session remains authenticated when the authenticator rejects invalidation.');
  equal(session.get('authenticatorFactory'), 'authenticators:test', 'Session does not unset the authenticator type when the authenticator rejects invalidation.');

  AuthenticatorMock._resolve = true;
  Ember.run(function() {
    session.invalidate();
  });

  ok(!session.get('isAuthenticated'), 'Session is not authenticated when invalidation with the authenticator resolves.');
  equal(session.get('aurhenticatorType'), null, 'Session unsets the authenticator type when invalidation with the authenticator resolves.');
  equal(session.get('content'), null, 'Session unsets its content when invalidation with the authenticator resolves.');

  Ember.run(function() {
    authenticatorMock.trigger('ember-simple-auth:session-updated', { key: 'other value' });
  });

  equal(session.get('key'), null, 'Session stops listening to the "ember-simple-auth:session-updated" event of the authenticator when invalidation with the authenticator resolves.');
});

test('observes changes in the authenticator', function() {
  AuthenticatorMock._resolve = true;
  Ember.run(function() {
    session.authenticate('authenticator').then(function() {
      authenticatorMock.trigger('ember-simple-auth:session-updated', { key: 'value' });
    });
  });

  equal(session.get('key'), 'value', 'Session updates its properties when the authenticator triggers the "ember-simple-auth:session-updated" event.');
});

test('observes changes in the store', function() {
  var otherAuthenticatorMock = AuthenticatorMock.create();
  ContainerMock._lookup      = otherAuthenticatorMock;
  AuthenticatorMock._resolve = false;
  Ember.run(function() {
    session.authenticate('authenticator').then(function() {
      storeMock.trigger('ember-simple-auth:session-updated', { key: 'value', authenticatorFactory: 'authenticators:test2' });
    });
  });

  equal(session.get('key'), null, 'Session does not update its properties when the store triggers the "ember-simple-auth:session-updated" event but the authenticator rejects.');
  equal(session.get('authenticatorFactory'), null, 'Session does not update the authenticator type when the store triggers the "ember-simple-auth:session-updated" event but the authenticator rejects.');

  AuthenticatorMock._resolve = { key: 'value' };
  Ember.run(function() {
    session.authenticate('authenticator').then(function() {
      storeMock.trigger('ember-simple-auth:session-updated', { key: 'value', authenticatorFactory: 'authenticators:test2' });
    });
  });

  equal(session.get('key'), 'value', 'Session updates its properties when the store triggers the "ember-simple-auth:session-updated" event and the authenticator resolves.');
  equal(session.get('authenticatorFactory'), 'authenticators:test2', 'Session updates the authenticator type when the store triggers the "ember-simple-auth:session-updated" event and the authenticator resolves.');
});
