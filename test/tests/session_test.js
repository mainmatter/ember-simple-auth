import { Session } from 'ember-simple-auth/session';
import { Ephemeral as EphemeralStore } from 'ember-simple-auth/stores/ephemeral';
import { Base as BaseAuthenticator } from 'ember-simple-auth/authenticators/base';
import { async } from './support/async';

describe('Session', function() {
  beforeEach(function() {
    this.store         = EphemeralStore.create();
    this.container     = { lookup: function() {} };
    this.authenticator = BaseAuthenticator.create();
    sinon.stub(this.container, 'lookup').returns(this.authenticator);
    this.session = Session.create({ store: this.store, container: this.container });
  });

  it('is not authenticated initially', function() {
    expect(this.session.get('isAuthenticated')).to.be(false);
  });

  function itListensToAuthenticatorEvents() {
    describe('when the authenticator triggers the "ember-simple-auth:session-updated" event', function() {
      beforeEach(async(function() {
        this.authenticator.trigger('ember-simple-auth:session-updated', { some: 'other property' });
      }));

      it('updates its content', async(function() {
        expect(this.session.get('content')).to.eql({ some: 'other property' });
      }));
    });
  }

  describe('initialization', function() {
    beforeEach(function() {
      this.store = EphemeralStore.create();
    });

    function failingToRestoreBehavior() {
      it('is not authenticated', async(function() {
        expect(this.session.get('isAuthenticated')).to.be(false);
      }));

      it('clears the store', function(done) {
        this.store.persist({ some: 'properties' });
        this.session = Session.create({ store: this.store, container: this.container });

        Ember.run.next(this, function() {
          expect(this.store.restore()).to.eql({});
          done();
        });
      });

      it('does not trigger the "ember-simple-auth:session-authentication-failed" event', function(done) {
        var triggered = false;
        this.session.on('ember-simple-auth:session-authentication-failed', function() { triggered = true; });

        Ember.run.next(this, function() {
          expect(triggered).to.be(false);
          done();
        });
      });
    }

    describe('when the restored properties contain an authenticator factory', function() {
      beforeEach(function() {
        this.store.persist({ authenticatorFactory: 'authenticatorFactory' });
      });

      describe('when the authenticator resolves restoration', function() {
        beforeEach(function() {
          sinon.stub(this.authenticator, 'restore').returns(Ember.RSVP.resolve({ some: 'properties' }));
          this.session = Session.create({ store: this.store, container: this.container });
        });

        it('is authenticated', async(function() {
          expect(this.session.get('isAuthenticated')).to.be(true);
        }));

        it('sets its content to the properties the auhneticator resolves with', async(function() {
          var properties = this.store.restore();
          delete properties.authenticatorFactory;

          expect(this.session.get('content')).to.eql({ some: 'properties' });
        }));

        it('persists its content in the store', async(function() {
          var properties = this.store.restore();
          delete properties.authenticatorFactory;

          expect(properties).to.eql({ some: 'properties' });
        }));

        it('persists the authenticator factory in the store', async(function(done) {
          expect(this.store.restore().authenticatorFactory).to.eql('authenticatorFactory');
        }));

        it('does not trigger the "ember-simple-auth:session-authentication-succeeded" event', function(done) {
          var triggered = false;
          this.session.on('ember-simple-auth:session-authentication-succeeded', function() { triggered = true; });

          Ember.run.next(this, function() {
            expect(triggered).to.be(false);
            done();
          });
        });

        itListensToAuthenticatorEvents();
      });

      describe('when the authenticator rejects restoration', function() {
        beforeEach(function() {
          sinon.stub(this.authenticator, 'restore').returns(Ember.RSVP.reject());
          this.session = Session.create({ store: this.store, container: this.container });
        });

        failingToRestoreBehavior();
      });
    });

    describe('when the restored properties do not contain an authenticator factory', function() {
      failingToRestoreBehavior();
    });
  });

  describe('authentication', function() {
    describe('when the authenticator resolves authnetication', function() {
      beforeEach(function() {
        sinon.stub(this.authenticator, 'authenticate').returns(Ember.RSVP.resolve({ some: 'properties' }));
        this.session.authenticate('authenticatorFactory');
      });

      it('is authenticated', async(function() {
        expect(this.session.get('isAuthenticated')).to.be(true);
      }));

      it('returns a resolving promise', function(done) {
        this.session.authenticate('authenticatorFactory').then(function() {
          expect(true).to.be.ok();
          done();
        }, function() {
          expect().fail();
          done();
        });
      });

      it('sets its content to the properties the auhneticator resolves with', async(function() {
        expect(this.session.get('content')).to.eql({ some: 'properties' });
      }));

      it('persists its content in the store', async(function() {
        var properties = this.store.restore();
        delete properties.authenticatorFactory;

        expect(properties).to.eql({ some: 'properties' });
      }));

      it('persists the authenticator factory in the store', async(function(done) {
        expect(this.store.restore().authenticatorFactory).to.eql('authenticatorFactory');
      }));

      it('triggers the "ember-simple-auth:session-authentication-succeeded" event', function(done) {
        var triggered = false;
        this.session.on('ember-simple-auth:session-authentication-succeeded', function() { triggered = true; });

        Ember.run.next(this, function() {
          expect(triggered).to.be(true);
          done();
        });
      });

      it('does not trigger the "ember-simple-auth:session-authentication-failed" event', function(done) {
        var triggered = false;
        this.session.on('ember-simple-auth:session-authentication-failed', function() { triggered = true; });

        Ember.run.next(this, function() {
          expect(triggered).to.be(false);
          done();
        });
      });

      itListensToAuthenticatorEvents();
    });

    describe('when the authenticator rejects authnetication', function() {
      beforeEach(function() {
        sinon.stub(this.authenticator, 'authenticate').returns(Ember.RSVP.reject());
        this.session.authenticate('authenticatorFactory');
      });

      it('is not authenticated', async(function() {
        expect(this.session.get('isAuthenticated')).to.be(false);
      }));

      it('returns a rejecting promise', function(done) {
        this.session.authenticate('authenticatorFactory').then(function() {
          expect().fail();
          done();
        }, function() {
          expect(true).to.be.ok();
          done();
        });
      });

      it('clears its content', function(done) {
        this.session.set('some', 'property');

        Ember.run.next(this, function() {
          expect(this.session.get('content')).to.eql({});
          done();
        });
      });

      it('clears the store', function(done) {
        this.store.persist({ some: 'property' });

        Ember.run.next(this, function() {
          expect(this.store.restore()).to.eql({});
          done();
        });
      });

      it('does not trigger the "ember-simple-auth:session-authentication-succeeded" event', function(done) {
        var triggered = false;
        this.session.on('ember-simple-auth:session-authentication-succeeded', function() { triggered = true; });

        Ember.run.next(this, function() {
          expect(triggered).to.be(false);
          done();
        });
      });

      it('triggers the "ember-simple-auth:session-authentication-failed" event', function(done) {
        var triggered = false;
        this.session.on('ember-simple-auth:session-authentication-failed', function() { triggered = true; });

        Ember.run.next(this, function() {
          expect(triggered).to.be(true);
          done();
        });
      });
    });
  });

  describe('invalidation', function() {
    beforeEach(function() {
      sinon.stub(this.authenticator, 'authenticate').returns(Ember.RSVP.resolve({ some: 'property' }));
      this.session.authenticate('authenticatorFactory');
    });

    describe('when the authenticator resolves invalidation', function() {
      beforeEach(function() {
        sinon.stub(this.authenticator, 'invalidate').returns(Ember.RSVP.resolve());
        this.session.invalidate();
      });

      it('is not authenticated', async(function() {
        expect(this.session.get('isAuthenticated')).to.be(false);
      }));

      it('returns a resolving promise', function(done) {
        this.session.invalidate().then(function() {
          expect(true).to.be.ok();
          done();
        }, function() {
          expect().fail();
          done();
        });
      });

      it('clears its content', function(done) {
        this.session.set('some', 'property');

        Ember.run.next(this, function() {
          expect(this.session.get('content')).to.eql({});
          done();
        });
      });

      it('clears the store', function(done) {
        this.store.persist({ some: 'property' });

        Ember.run.next(this, function() {
          expect(this.store.restore()).to.eql({});
          done();
        });
      });

      it('does not trigger the "ember-simple-auth:session-invalidation-failed" event', function(done) {
        var triggered = false;
        this.session.on('ember-simple-auth:session-invalidation-failed', function() { triggered = true; });

        Ember.run.next(this, function() {
          expect(triggered).to.be(false);
          done();
        });
      });

      it('triggers the "ember-simple-auth:session-invalidation-succeeded" event', function(done) {
        var triggered = false;
        this.session.on('ember-simple-auth:session-invalidation-succeeded', function() { triggered = true; });

        Ember.run.next(this, function() {
          expect(triggered).to.be(true);
          done();
        });
      });
    });

    describe('when the authenticator rejects invalidation', function() {
      beforeEach(function() {
        sinon.stub(this.authenticator, 'invalidate').returns(Ember.RSVP.reject());
        this.session.invalidate();
      });

      it('stays authenticated', async(function() {
        expect(this.session.get('isAuthenticated')).to.be(true);
      }));

      it('returns a rejecting promise', function(done) {
        this.session.invalidate().then(function() {
          expect().fail();
          done();
        }, function() {
          expect(true).to.be.ok();
          done();
        });
      });

      it('keeps its content', async(function() {
        expect(this.session.get('content')).to.eql({ some: 'property' });
      }));

      it('keeps the store', async(function() {
        expect(this.store.restore()).to.eql({ some: 'property', authenticatorFactory: 'authenticatorFactory' });
      }));

      it('triggers the "ember-simple-auth:session-invalidation-failed" event', function(done) {
        var triggered = false;
        this.session.on('ember-simple-auth:session-invalidation-failed', function() { triggered = true; });

        Ember.run.next(this, function() {
          expect(triggered).to.be(true);
          done();
        });
      });

      it('does not trigger the "ember-simple-auth:session-invalidation-succeeded" event', function(done) {
        var triggered = false;
        this.session.on('ember-simple-auth:session-invalidation-succeeded', function() { triggered = true; });

        Ember.run.next(this, function() {
          expect(triggered).to.be(false);
          done();
        });
      });

      itListensToAuthenticatorEvents();
    });
  });
});

/*import { Session } from 'ember-simple-auth/session';


test('invalidates itself', function() {
  var triggeredSucceeded;
  var triggeredFailed;
  var triggeredFailedWith;
  AuthenticatorMock._resolve = false;
  AuthenticatorMock._reject = { error: 'message' };
  session.set('isAuthenticated', true);
  Ember.run(function() {
    session.set('authenticatorFactory', 'authenticators:test');
    session.set('content', { key: 'value' });
    session.one('ember-simple-auth:session-invalidation-succeeded', function() {
      triggeredSucceeded = true;
    });
    session.one('ember-simple-auth:session-invalidation-failed', function(error) {
      triggeredFailed     = true;
      triggeredFailedWith = error;
    });
    session.invalidate();
  });

  ok(authenticatorMock.invalidateInvoked, 'Session invalidates with the passed authenticator.');
  deepEqual(authenticatorMock.invalidateInvokedWith, { key: 'value' }, 'Session passes its content to the authenticator to invalidation.');
  ok(session.get('isAuthenticated'), 'Session remains authenticated when the authenticator rejects invalidation.');
  equal(session.get('authenticatorFactory'), 'authenticators:test', 'Session does not unset the authenticator type when the authenticator rejects invalidation.');
  ok(!triggeredSucceeded, 'Session does not trigger the "ember-simple-auth:session-invalidation-succeeded" event when the authenticator rejects invalidation.');
  ok(triggeredFailed, 'Session triggers the "ember-simple-auth:session-invalidation-failed" event when the authenticator rejects invalidation.');
  deepEqual(triggeredFailedWith, { error: 'message' }, 'Session triggers the "ember-simple-auth:session-invalidation-failed" event with the correct error when the authenticator rejects invalidation.');

  triggeredSucceeded = false;
  triggeredFailed = false;
  AuthenticatorMock._resolve = true;
  Ember.run(function() {
    session.one('ember-simple-auth:session-invalidation-succeeded', function() {
      triggeredSucceeded = true;
    });
    session.one('ember-simple-auth:session-invalidation-failed', function() {
      triggeredFailed = true;
    });
    session.invalidate();
  });

  ok(!session.get('isAuthenticated'), 'Session is not authenticated when invalidation with the authenticator resolves.');
  equal(session.get('aurhenticatorType'), null, 'Session unsets the authenticator type when invalidation with the authenticator resolves.');
  equal(session.get('content'), null, 'Session unsets its content when invalidation with the authenticator resolves.');
  ok(triggeredSucceeded, 'Session triggers the "ember-simple-auth:session-invalidation-succeeded" event when the authenticator resolves.');
  ok(!triggeredFailed, 'Session does not trigger the "ember-simple-auth:session-invalidation-failed" event when the authenticator resolves.');

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
  var triggeredAuthentication;
  var triggeredInvalidation;
  AuthenticatorMock._resolve = true;
  ContainerMock._lookup      = AuthenticatorMock.create();
  Ember.run(function() {
    session.one('ember-simple-auth:session-invalidation-succeeded', function() {
      triggeredInvalidation = true;
    });
    session.authenticate('authenticator').then(function() {
      AuthenticatorMock._resolve = false;
      storeMock.trigger('ember-simple-auth:session-updated', { key: 'value', authenticatorFactory: 'authenticators:test2' });
    });
  });

  equal(session.get('key'), null, 'Session does not update its properties when the store triggers the "ember-simple-auth:session-updated" event but the authenticator rejects.');
  equal(session.get('authenticatorFactory'), null, 'Session does not update the authenticator type when the store triggers the "ember-simple-auth:session-updated" event but the authenticator rejects.');
  ok(triggeredInvalidation, 'Session triggers the "ember-simple-auth:session-authentication-succeeded" event when the store triggers the "ember-simple-auth:session-updated" event and the authenticator rejects.');

  triggeredInvalidation = false;
  AuthenticatorMock._resolve = { key: 'value' };
  Ember.run(function() {
    session.one('ember-simple-auth:session-invalidation-succeeded', function() {
      triggeredInvalidation = true;
    });
    session.authenticate('authenticator').then(function() {
      storeMock.trigger('ember-simple-auth:session-updated', { key: 'value' });
    });
  });

  equal(session.get('key'), null, 'Ember.Session clears its properties when the store triggers the "ember-simple-auth:session-updated" event and there is no authenticator factory in the stored properties.');
  equal(session.get('authenticatorFactory'), null, 'Ember.Session unsets its authenticator type when the store triggers the "ember-simple-auth:session-updated" event and there is no authenticator factory in the stored properties.');
  ok(triggeredInvalidation, 'Session triggers the "ember-simple-auth:session-authentication-succeeded" event when the store triggers the "ember-simple-auth:session-updated" event and there is no authenticator factory in the stored properties.');

  AuthenticatorMock._resolve = { key: 'value' };
  Ember.run(function() {
    session.one('ember-simple-auth:session-authentication-succeeded', function() {
      triggeredAuthentication = true;
    });
    session.invalidate('authenticator').then(function() {
      storeMock.trigger('ember-simple-auth:session-updated', { key: 'value', authenticatorFactory: 'authenticators:test2' });
    });
  });

  equal(session.get('key'), 'value', 'Ember.Session updates its properties when the store triggers the "ember-simple-auth:session-updated" event and the authenticator resolves.');
  equal(session.get('authenticatorFactory'), 'authenticators:test2', 'Ember.Session updates the authenticator type when the store triggers the "ember-simple-auth:session-updated" event and the authenticator resolves.');
  ok(triggeredAuthentication, 'Session triggers the "ember-simple-auth:session-authentication-succeeded" event when the store triggers the "ember-simple-auth:session-updated" event and the authenticator resolves.');
});
*/