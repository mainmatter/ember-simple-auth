/* jshint expr:true */
import { it } from 'ember-mocha';
import Ember from 'ember';
import Session from 'ember-simple-auth/session';
import EphemeralStore from 'ember-simple-auth/stores/ephemeral';
import Authenticator from 'ember-simple-auth/authenticators/base';

let store;
let container;
let authenticator;
let session;

describe('Session', function() {
  beforeEach(function() {
    store         = EphemeralStore.create();
    container     = { lookup: function() {} };
    authenticator = Authenticator.create();
    session       = Session.create();
    sinon.stub(container, 'lookup').returns(authenticator);
  });

  it('does not allow data to be stored for the key "secure"', function() {
    expect(function() {
      session.set('secure', 'test');
    }).to.throw(Error);
  });

  function itHandlesAuthenticatorEvents(preparation) {
    context('when the authenticator triggers the "sessionDataUpdated" event', function() {
      beforeEach(function() {
        return preparation.apply(this);
      });

      it('stores the data the event is triggered with in its secure section', function(done) {
        authenticator.trigger('sessionDataUpdated', { some: 'property' });

        Ember.run.next(function() {
          expect(session.get('secure')).to.eql({ some: 'property', authenticator: 'authenticator' });
          done();
        });
      });
    });

    context('when the authenticator triggers the "invalidated" event', function() {
      beforeEach(function() {
        return preparation.apply(this);
      });

      it('is not authenticated', function(done) {
        authenticator.trigger('sessionDataInvalidated');

        Ember.run.next(function() {
          expect(session.get('isAuthenticated')).to.be.false;
          done();
        });
      });

      it('clears its secure section', function(done) {
        session.set('content', { some: 'property', secure: { some: 'other property' } });
        authenticator.trigger('sessionDataInvalidated');

        Ember.run.next(function() {
          expect(session.get('content.secure')).to.eql({});
          done();
        });
      });

      it('updates the store', function(done) {
        authenticator.trigger('sessionDataInvalidated');

        Ember.run.next(function() {
          expect(store.restore().secure).to.eql({});
          done();
        });
      });

      it('triggers the "sessionInvalidationSucceeded" event', function(done) {
        var triggered = false;
        session.one('sessionInvalidationSucceeded', function() {
          triggered = true;
        });
        authenticator.trigger('sessionDataInvalidated');

        Ember.run.next(function() {
          expect(triggered).to.be.true;
          done();
        });
      });
    });
  }

  describe('restore', function() {
    beforeEach(function() {
      
      session.set('content', {});
      session.setProperties({ store: store, container: container });
    });

    function itDoesNotRestore() {
      it('returns a rejecting promise', function() {
        return session.restore().then(null, function() {
          expect(true).to.be.true;
        });
      });

      it('is not authenticated', function() {
        return session.restore().then(null, function() {
          expect(session.get('isAuthenticated')).to.be.false;
        });
      });

      it('clears its secure section', function() {
        session.set('content', { secure: { some: 'other property' } });

        return session.restore().then(null, function() {
          expect(session.get('content.secure')).to.eql({});
        });
      });

      it('does not trigger the "sessionAuthenticationFailed" event', function() {
        var triggered = false;
        session.one('sessionAuthenticationFailed', function() { triggered = true; });

        return session.restore().then(null, function() {
          expect(triggered).to.be.false;
        });
      });
    }

    context('when the restored data contains an authenticator factory', function() {
      beforeEach(function() {
        store.persist({ secure: { authenticator: 'authenticator' } });
      });

      context('when the authenticator resolves restoration', function() {
        beforeEach(function() {
          sinon.stub(authenticator, 'restore').returns(Ember.RSVP.resolve({ some: 'property' }));
        });

        it('returns a resolving promise', function() {
          return session.restore().then(function() {
            expect(true).to.be.true;
          });
        });

        it('is authenticated', function() {
          return session.restore().then(function() {
            expect(session.get('isAuthenticated')).to.be.true;
          });
        });

        it('stores the data the authenticator resolves with in its secure section', function() {
          store.persist({ secure: { authenticator: 'authenticator' } });

          return session.restore().then(function() {
            var properties = store.restore();
            delete properties.authenticator;

            expect(session.get('secure')).to.eql({ some: 'property', authenticator: 'authenticator' });
          });
        });

        it('persists its content in the store', function() {
          return session.restore().then(function() {
            var properties = store.restore();
            delete properties.authenticator;

            expect(properties).to.eql({ secure: { some: 'property', authenticator: 'authenticator' } });
          });
        });

        it('persists the authenticator factory in the store', function() {
          return session.restore().then(function() {
            expect(store.restore().secure.authenticator).to.eql('authenticator');
          });
        });

        it('does not trigger the "sessionAuthenticationSucceeded" event', function() {
          var triggered = false;
          session.one('sessionAuthenticationSucceeded', function() { triggered = true; });

          return session.restore().then(function() {
            expect(triggered).to.be.false;
          });
        });

        itHandlesAuthenticatorEvents(function() {
          return session.restore();
        });
      });

      context('when the authenticator rejects restoration', function() {
        beforeEach(function() {
          sinon.stub(authenticator, 'restore').returns(Ember.RSVP.reject());
        });

        itDoesNotRestore();
      });
    });

    context('when the restored data does not contain an authenticator factory', function() {
      itDoesNotRestore();
    });
  });

  describe('authentication', function() {
    beforeEach(function() {
      session = Session.create();
      session.set('content', {});
      session.setProperties({ store: store, container: container });
    });

    context('when the authenticator resolves authentication', function() {
      beforeEach(function() {
        sinon.stub(authenticator, 'authenticate').returns(Ember.RSVP.resolve({ some: 'property' }));
      });

      it('is authenticated', function() {
        return session.authenticate('authenticator').then(function() {
          expect(session.get('isAuthenticated')).to.be.true;
        });
      });

      it('returns a resolving promise', function() {
        return session.authenticate('authenticator').then(function() {
          expect(true).to.be.true;
        });
      });

      it('stores the data the authenticator resolves with in its secure section', function() {
        return session.authenticate('authenticator').then(function() {
          expect(session.get('secure')).to.eql({ some: 'property', authenticator: 'authenticator' });
        });
      });

      it('persists its content in the store', function() {
        return session.authenticate('authenticator').then(function() {
          var properties = store.restore();
          delete properties.authenticator;

          expect(properties).to.eql({ secure: { some: 'property', authenticator: 'authenticator' } });
        });
      });

      it('persists the authenticator factory in the store', function() {
        return session.authenticate('authenticator').then(function() {
          expect(store.restore().secure.authenticator).to.eql('authenticator');
        });
      });

      it('triggers the "sessionAuthenticationSucceeded" event', function() {
        var triggered = false;
        session.one('sessionAuthenticationSucceeded', function() {
          triggered = true;
        });

        return session.authenticate('authenticator').then(function() {
          expect(true).to.be.true;
        });
      });

      it('does not trigger the "sessionAuthenticationFailed" event', function() {
        var triggered = false;
        session.one('sessionAuthenticationFailed', function() { triggered = true; });

        return session.authenticate('authenticator').then(function() {
          expect(triggered).to.be.false;
        });
      });

      itHandlesAuthenticatorEvents(function() {
        return session.authenticate('authenticator');
      });
    });

    context('when the authenticator rejects authentication', function() {
      it('is not authenticated', function() {
        sinon.stub(authenticator, 'authenticate').returns(Ember.RSVP.reject('error auth'));

        return session.authenticate('authenticator').then(null, function() {
          expect(session.get('isAuthenticated')).to.be.false;
        });
      });

      it('returns a rejecting promise', function() {
        sinon.stub(authenticator, 'authenticate').returns(Ember.RSVP.reject('error auth'));

        return session.authenticate('authenticator').then(null, function() {
          expect(true).to.be.true;
        });
      });

      it('clears its secure section', function() {
        sinon.stub(authenticator, 'authenticate').returns(Ember.RSVP.reject('error auth'));
        session.set('content', { some: 'property', secure: { some: 'other property' } });

        return session.authenticate('authenticator').then(null, function() {
          expect(session.get('content')).to.eql({ some: 'property', secure: {} });
        });
      });

      it('updates the store', function() {
        sinon.stub(authenticator, 'authenticate').returns(Ember.RSVP.reject('error auth'));
        session.set('content', { some: 'property', secure: { some: 'other property' } });

        return session.authenticate('authenticator').then(null, function() {
          expect(store.restore()).to.eql({ some: 'property', secure: {} });
        });
      });

      it('does not trigger the "sessionAuthenticationSucceeded" event', function() {
        var triggered = false;
        sinon.stub(authenticator, 'authenticate').returns(Ember.RSVP.reject('error auth'));
        session.one('sessionAuthenticationSucceeded', function() { triggered = true; });

        return session.authenticate('authenticator').then(null, function() {
          expect(triggered).to.be.false;
        });
      });

      it('triggers the "sessionAuthenticationFailed" event', function() {
        var triggered = false;
        sinon.stub(authenticator, 'authenticate').returns(Ember.RSVP.reject('error'));
        session.one('sessionAuthenticationFailed', function(error) {
          triggered = error;
        });

        return session.authenticate('authenticator').then(null, function() {
          expect(triggered).to.eql('error');
        });
      });
    });
  });

  describe('invalidation', function() {
    beforeEach(function() {
      session.set('content', {});
      session.setProperties({ store: store, container: container });
      sinon.stub(authenticator, 'authenticate').returns(Ember.RSVP.resolve({ some: 'property' }));

      return session.authenticate('authenticator');
    });

    context('when the authenticator resolves invaldiation', function() {
      beforeEach(function() {
        sinon.stub(authenticator, 'invalidate').returns(Ember.RSVP.resolve());
      });

      it('is not authenticated', function() {
        return session.invalidate().then(function() {
          expect(session.get('isAuthenticated')).to.be.false;
        });
      });

      it('returns a resolving promise', function() {
        return session.invalidate().then(function() {
          expect(true).to.be.true;
        });
      });

      it('clears its secure section', function() {
        session.set('content', { some: 'property', secure: { some: 'other property' } });

        return session.invalidate().then(function() {
          expect(session.get('content')).to.eql({ some: 'property', secure: {} });
        });
      });

      it('updates the store', function() {
        session.set('content', { some: 'property', secure: { some: 'other property' } });

        return session.invalidate().then(function() {
          expect(store.restore()).to.eql({ some: 'property', secure: {} });
        });
      });

      it('does not trigger the "sessionInvalidationFailed" event', function() {
        var triggered = false;
        session.one('sessionInvalidationFailed', function() { triggered = true; });

        return session.invalidate().then(function() {
          expect(triggered).to.be.false;
        });
      });

      it('triggers the "sessionInvalidationSucceeded" event', function() {
        var triggered = false;
        session.one('sessionInvalidationSucceeded', function() {
          triggered = true;
        });

        return session.invalidate().then(function() {
          expect(triggered).to.be.true;
        });
      });
    });

    context('when the authenticator rejects invalidation', function() {
      it('stays authenticated', function() {
        sinon.stub(authenticator, 'invalidate').returns(Ember.RSVP.reject('error'));

        return session.invalidate().then(null, function() {
          expect(session.get('isAuthenticated')).to.be.true;
        });
      });

      it('returns a rejecting promise', function() {
        sinon.stub(authenticator, 'invalidate').returns(Ember.RSVP.reject('error'));

        return session.invalidate().then(null, function() {
          expect(true).to.be.true;
        });
      });

      it('keeps its content', function() {
        sinon.stub(authenticator, 'invalidate').returns(Ember.RSVP.reject('error'));

        return session.invalidate().then(null, function() {
          expect(session.get('secure')).to.eql({ some: 'property', authenticator: 'authenticator' });
        });
      });

      it('does not update the store', function() {
        sinon.stub(authenticator, 'invalidate').returns(Ember.RSVP.reject('error'));

        return session.invalidate().then(null, function() {
          expect(store.restore()).to.eql({ secure: { some: 'property', authenticator: 'authenticator' } });
        });
      });

      it('triggers the "sessionInvalidationFailed" event', function() {
        var triggerd = false;
        sinon.stub(authenticator, 'invalidate').returns(Ember.RSVP.reject('error'));
        session.one('sessionInvalidationFailed', function(error) {
          triggerd = error;
        });

        return session.invalidate().then(null, function() {
          expect(triggerd).to.eql('error');
        });
      });

      it('does not trigger the "sessionInvalidationSucceeded" event', function() {
        sinon.stub(authenticator, 'invalidate').returns(Ember.RSVP.reject('error'));
        var triggered = false;
        session.one('sessionInvalidationSucceeded', function() { triggered = true; });

        return session.invalidate().then(null, function() {
          expect(triggered).to.be.false;
        });
      });

      itHandlesAuthenticatorEvents(Ember.K);
    });
  });

  describe("when the session's content changes", function() {
    context('when a single property is set', function() {
      beforeEach(function() {
        session = Session.create({ store: store });
        session.set('some', 'property');
      });

      it('persists its content in the store', function() {
        var properties = store.restore();
        delete properties.authenticator;

        expect(properties).to.eql({ some: 'property', secure: {} });
      });
    });

    context('when multiple properties are set at once', function() {
      beforeEach(function() {
        session = Session.create({ store: store });
        session.set('some', 'property');
        session.setProperties({ multiple: 'properties' });
      });

      it('persists its content in the store', function() {
        var properties = store.restore();
        delete properties.authenticator;

        expect(properties).to.eql({ some: 'property', multiple: 'properties', secure: {} });
      });
    });
  });

  context('when the store triggers the "sessionDataUpdated" event', function() {
    beforeEach(function() {
      session = Session.create();
      session.setProperties({ store: store, container: container });
    });

    context('when there is an authenticator factory in the event data', function() {
      context('when the authenticator resolves restoration', function() {
        beforeEach(function() {
          sinon.stub(authenticator, 'restore').returns(Ember.RSVP.resolve({ some: 'other property' }));
        });

        it('is authenticated', function(done) {
          store.trigger('sessionDataUpdated', { some: 'other property', secure: { authenticator: 'authenticator' } });

          Ember.run.next(function() {
            expect(session.get('isAuthenticated')).to.be.true;
            done();
          });
        });

        it('stores the data the authenticator resolves with in its secure section', function(done) {
          store.trigger('sessionDataUpdated', { some: 'property', secure: { authenticator: 'authenticator' } });

          Ember.run.next(function() {
            expect(session.get('secure')).to.eql({ some: 'other property', authenticator: 'authenticator' });
            done();
          });
        });

        it('persists its content in the store', function(done) {
          store.trigger('sessionDataUpdated', { some: 'property', secure: { authenticator: 'authenticator' } });

          Ember.run.next(function() {
            var properties = store.restore();

            expect(properties).to.eql({ some: 'property', secure: { some: 'other property', authenticator: 'authenticator' } });
            done();
          });
        });

        context('when the session is already authenticated', function() {
          beforeEach(function() {
            session.set('isAuthenticated', true);
          });

          it('does not trigger the "sessionAuthenticationSucceeded" event', function(done) {
            var triggered = false;
            session.one('sessionAuthenticationSucceeded', function() { triggered = true; });
            store.trigger('sessionDataUpdated', { some: 'other property', secure: { authenticator: 'authenticator' } });

            Ember.run.next(function() {
              expect(triggered).to.be.false;
              done();
            });
          });
        });

        context('when the session is not already authenticated', function() {
          beforeEach(function() {
            session.set('isAuthenticated', false);
          });

          it('triggers the "sessionAuthenticationSucceeded" event', function(done) {
            var triggered = false;
            session.one('sessionAuthenticationSucceeded', function() {
              triggered = true;
            });
            store.trigger('sessionDataUpdated', { some: 'other property', secure: { authenticator: 'authenticator' } });

            Ember.run.next(function() {
              expect(triggered).to.be.true;
              done();
            });
          });
        });
      });

      context('when the authenticator rejects restoration', function() {
        beforeEach(function() {
          sinon.stub(authenticator, 'restore').returns(Ember.RSVP.reject());
        });

        it('is not authenticated', function(done) {
          store.trigger('sessionDataUpdated', { some: 'other property', secure: { authenticator: 'authenticator' } });

          Ember.run.next(function() {
            expect(session.get('isAuthenticated')).to.be.false;
            done();
          });
        });

        it('clears its secure section', function(done) {
          session.set('content', { some: 'property', secure: { some: 'other property' } });
          store.trigger('sessionDataUpdated', { some: 'other property', secure: { authenticator: 'authenticator' } });

          Ember.run.next(function() {
            expect(session.get('content.secure')).to.eql({});
            done();
          });
        });

        it('updates the store', function(done) {
          session.set('content', { some: 'property', secure: { some: 'other property' } });
          store.trigger('sessionDataUpdated', { some: 'other property', secure: { authenticator: 'authenticator' } });

          Ember.run.next(function() {
            expect(store.restore()).to.eql({ some: 'other property', secure: {} });
            done();
          });
        });

        context('when the session is authenticated', function() {
          beforeEach(function() {
            session.set('isAuthenticated', true);
          });

          it('triggers the "sessionInvalidationSucceeded" event', function(done) {
            var triggered = false;
            session.one('sessionInvalidationSucceeded', function() {
              triggered = true;
            });
            store.trigger('sessionDataUpdated', { some: 'other property', secure: { authenticator: 'authenticator' } });

            Ember.run.next(function() {
              expect(triggered).to.be.true;
              done();
            });
          });
        });

        context('when the session is not authenticated', function() {
          beforeEach(function() {
            session.set('isAuthenticated', false);
          });

          it('does not trigger the "sessionInvalidationSucceeded" event', function(done) {
            var triggered = false;
            session.one('sessionInvalidationSucceeded', function() { triggered = true; });

            Ember.run.next(function() {
              expect(triggered).to.be.false;
              done();
            });
          });
        });
      });
    });

    context('when there is no authenticator factory in the store', function() {
      it('is not authenticated', function(done) {
        store.trigger('sessionDataUpdated', { some: 'other property' });

        Ember.run.next(function() {
          expect(session.get('isAuthenticated')).to.be.false;
          done();
        });
      });

      it('clears its secure section', function(done) {
        session.set('content', { some: 'property', secure: { some: 'other property' } });
        store.trigger('sessionDataUpdated', { some: 'other property' });

        Ember.run.next(function() {
          expect(session.get('content')).to.eql({ some: 'other property', secure: {} });
          done();
        });
      });

      it('updates the store', function(done) {
        session.set('content', { some: 'property', secure: { some: 'other property' } });
        store.trigger('sessionDataUpdated', { some: 'other property' });

        Ember.run.next(function() {
          expect(store.restore()).to.eql({ some: 'other property', secure: {} });
          done();
        });
      });

      context('when the session is authenticated', function() {
        beforeEach(function() {
          session.set('isAuthenticated', true);
        });

        it('triggers the "sessionInvalidationSucceeded" event', function(done) {
          var triggered = false;
          session.one('sessionInvalidationSucceeded', function() {
            triggered = true;
          });
          store.trigger('sessionDataUpdated', { some: 'other property' });

          Ember.run.next(function() {
            expect(triggered).to.be.true;
            done();
          });
        });
      });

      context('when the session is not authenticated', function() {
        beforeEach(function() {
          session.set('isAuthenticated', false);
        });

        it('does not trigger the "sessionInvalidationSucceeded" event', function(done) {
          var triggered = false;
          session.one('sessionInvalidationSucceeded', function() { triggered = true; });

          Ember.run.next(function() {
            expect(triggered).to.be.false;
            done();
          });
        });
      });
    });
  });
});
