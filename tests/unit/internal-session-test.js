import RSVP from 'rsvp';
import { next } from '@ember/runloop';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinonjs from 'sinon';
import InternalSession from 'ember-simple-auth/internal-session';
import EphemeralStore from 'ember-simple-auth/session-stores/ephemeral';
import Authenticator from 'ember-simple-auth/authenticators/base';

import createWithContainer from '../helpers/create-with-container';

describe('InternalSession', () => {
  let sinon;
  let session;
  let store;
  let authenticator;
  let container;

  beforeEach(function() {
    sinon = sinonjs.sandbox.create();
    container = { lookup() {} };
    store = EphemeralStore.create();
    authenticator = Authenticator.create();
    session = createWithContainer(InternalSession, { store }, container);
    sinon.stub(container, 'lookup').withArgs('authenticator').returns(authenticator);
  });

  afterEach(function() {
    sinon.restore();
  });

  it('does not allow data to be stored for the key "authenticated"', function() {
    expect(() => {
      session.set('authenticated', 'test');
    }).to.throw(Error);
  });

  function itHandlesAuthenticatorEvents(preparation) {
    describe('when the authenticator triggers the "sessionDataUpdated" event', function() {
      beforeEach(function() {
        return preparation.call();
      });

      it('stores the data the event is triggered with in its authenticated section', function(done) {
        authenticator.trigger('sessionDataUpdated', { some: 'property' });

        next(() => {
          expect(session.get('authenticated')).to.eql({ some: 'property', authenticator: 'authenticator' });
          done();
        });
      });
    });

    describe('when the authenticator triggers the "invalidated" event', function() {
      beforeEach(function() {
        return preparation.call();
      });

      it('is not authenticated', function(done) {
        authenticator.trigger('sessionDataInvalidated');

        next(() => {
          expect(session.get('isAuthenticated')).to.be.false;
          done();
        });
      });

      it('clears its authenticated section', function(done) {
        session.set('content', { some: 'property', authenticated: { some: 'other property' } });
        authenticator.trigger('sessionDataInvalidated');

        next(() => {
          expect(session.get('content')).to.eql({ some: 'property', authenticated: {} });
          done();
        });
      });

      it('updates the store', function(done) {
        authenticator.trigger('sessionDataInvalidated');

        next(() => {
          store.restore().then((properties) => {
            expect(properties.authenticated).to.eql({});
            done();
          });
        });
      });

      it('triggers the "invalidationSucceeded" event', function(done) {
        let triggered = false;
        session.one('invalidationSucceeded', () => {
          triggered = true;
        });
        authenticator.trigger('sessionDataInvalidated');

        next(() => {
          expect(triggered).to.be.true;
          done();
        });
      });
    });
  }

  describe('restore', function() {
    function itDoesNotRestore() {
      it('returns a rejecting promise', function() {
        return session.restore().catch(() => {
          expect(true).to.be.true;
        });
      });

      it('is not authenticated', function() {
        return session.restore().catch(() => {
          expect(session.get('isAuthenticated')).to.be.false;
        });
      });

      it('clears its authenticated section', function() {
        store.persist({ some: 'property', authenticated: { some: 'other property' } });

        return session.restore().catch(() => {
          expect(session.get('content')).to.eql({ some: 'property', authenticated: {} });
        });
      });
    }

    describe('when the restored data contains an authenticator factory', function() {
      beforeEach(function() {
        store.persist({ authenticated: { authenticator: 'authenticator' } });
      });

      describe('when the authenticator resolves restoration', function() {
        beforeEach(function() {
          sinon.stub(authenticator, 'restore').returns(RSVP.resolve({ some: 'property' }));
        });

        it('returns a resolving promise', function() {
          return session.restore().then(() => {
            expect(true).to.be.true;
          });
        });

        it('is authenticated', function() {
          return session.restore().then(() => {
            expect(session.get('isAuthenticated')).to.be.true;
          });
        });

        it('stores the data the authenticator resolves with in its authenticated section', function() {
          return store.persist({ authenticated: { authenticator: 'authenticator' } }).then(() => {
            return session.restore().then(() => {
              return store.restore().then((properties) => {
                delete properties.authenticator;

                expect(session.get('authenticated')).to.eql({ some: 'property', authenticator: 'authenticator' });
              });
            });
          });
        });

        it('persists its content in the store', function() {
          return store.persist({ authenticated: { authenticator: 'authenticator' }, someOther: 'property' }).then(() => {
            return session.restore().then(() => {
              return store.restore().then((properties) => {
                delete properties.authenticator;

                expect(properties).to.eql({ authenticated: { some: 'property', authenticator: 'authenticator' }, someOther: 'property' });
              });
            });
          });
        });

        it('persists the authenticator factory in the store', function() {
          return session.restore().then(() => {
            return store.restore().then((properties) => {
              expect(properties.authenticated.authenticator).to.eql('authenticator');
            });
          });
        });

        it('does not trigger the "authenticationSucceeded" event', function() {
          let triggered = false;
          session.one('authenticationSucceeded', () => (triggered = true));

          return session.restore().then(() => {
            expect(triggered).to.be.false;
          });
        });

        itHandlesAuthenticatorEvents(() => {
          return session.restore();
        });
      });

      describe('when the authenticator rejects restoration', function() {
        beforeEach(function() {
          sinon.stub(authenticator, 'restore').returns(RSVP.reject());
        });

        itDoesNotRestore();
      });
    });

    describe('when the restored data does not contain an authenticator factory', function() {
      itDoesNotRestore();
    });

    describe('when the store rejects restoration', function() {
      beforeEach(function() {
        sinon.stub(store, 'restore').returns(RSVP.Promise.reject());
      });

      it('is not authenticated', function() {
        return session.restore().then(() => {
          expect(session.get('isAuthenticated')).to.be.false;
        });
      });
    });

    describe('when the store rejects persistance', function() {
      beforeEach(function() {
        sinon.stub(store, 'persist').returns(RSVP.reject());
      });

      it('is not authenticated', function() {
        return session.restore().then(() => {
          expect(session.get('isAuthenticated')).to.be.false;
        });
      });
    });

    describe('with older synchronous stores (< v1.1.0)', function() {
      describe('when restoring the session', function() {
        beforeEach(function() {
          sinon.stub(store, 'persist').returns();
          sinon.stub(store, 'clear').returns();
        });

        describe('when the store resolves restoration', function() {
          beforeEach(function() {
            sinon.stub(store, 'restore').returns({ authenticated: { authenticator: 'authenticator' } });
          });

          it('is authenticated', function() {
            return session.restore().then(() => {
              expect(session.get('isAuthenticated')).to.be.true;
            });
          });
        });

        describe('when the store rejects restoration', function() {
          beforeEach(function() {
            sinon.stub(store, 'restore').returns({});
          });

          it('is not authenticated', function() {
            return session.restore().then(() => {
              expect(session.get('isAuthenticated')).to.be.false;
            });
          });
        });
      });
    });
  });

  describe('authentication', function() {
    describe('when the authenticator resolves authentication', function() {
      beforeEach(function() {
        sinon.stub(authenticator, 'authenticate').returns(RSVP.resolve({ some: 'property' }));
      });

      it('is authenticated', function() {
        return session.authenticate('authenticator').then(() => {
          expect(session.get('isAuthenticated')).to.be.true;
        });
      });

      it('returns a resolving promise', function() {
        return session.authenticate('authenticator').then(() => {
          expect(true).to.be.true;
        });
      });

      it('stores the data the authenticator resolves with in its authenticated section', function() {
        return session.authenticate('authenticator').then(() => {
          expect(session.get('authenticated')).to.eql({ some: 'property', authenticator: 'authenticator' });
        });
      });

      it('persists its content in the store', function() {
        return session.authenticate('authenticator').then(() => {
          return store.restore().then((properties) => {
            delete properties.authenticator;

            expect(properties).to.eql({ authenticated: { some: 'property', authenticator: 'authenticator' } });
          });
        });
      });

      it('persists the authenticator factory in the store', function() {
        return session.authenticate('authenticator').then(() => {
          return store.restore().then((properties) => {
            expect(properties.authenticated.authenticator).to.eql('authenticator');
          });
        });
      });

      it('triggers the "authenticationSucceeded" event', function() {
        let triggered = false;
        session.one('authenticationSucceeded', () => (triggered = true));

        return session.authenticate('authenticator').then(() => {
          expect(triggered).to.be.true;
        });
      });

      itHandlesAuthenticatorEvents(() => {
        return session.authenticate('authenticator');
      });
    });

    describe('when the authenticator rejects authentication', function() {
      it('is not authenticated', function() {
        sinon.stub(authenticator, 'authenticate').returns(RSVP.reject('error auth'));

        return session.authenticate('authenticator').catch(() => {
          expect(session.get('isAuthenticated')).to.be.false;
        });
      });

      it('returns a rejecting promise', function() {
        sinon.stub(authenticator, 'authenticate').returns(RSVP.reject('error auth'));

        return session.authenticate('authenticator').catch(() => {
          expect(true).to.be.true;
        });
      });

      it('clears its authenticated section', function() {
        sinon.stub(authenticator, 'authenticate').returns(RSVP.reject('error auth'));
        session.set('content', { some: 'property', authenticated: { some: 'other property' } });

        return session.authenticate('authenticator').catch(() => {
          expect(session.get('content')).to.eql({ some: 'property', authenticated: {} });
        });
      });

      it('updates the store', function() {
        sinon.stub(authenticator, 'authenticate').returns(RSVP.reject('error auth'));
        session.set('content', { some: 'property', authenticated: { some: 'other property' } });

        return session.authenticate('authenticator').catch(() => {
          return store.restore().then((properties) => {
            expect(properties).to.eql({ some: 'property', authenticated: {} });
          });
        });
      });

      it('does not trigger the "authenticationSucceeded" event', function() {
        let triggered = false;
        sinon.stub(authenticator, 'authenticate').returns(RSVP.reject('error auth'));
        session.one('authenticationSucceeded', () => (triggered = true));

        return session.authenticate('authenticator').catch(() => {
          expect(triggered).to.be.false;
        });
      });
    });

    describe('when the store rejects persistance', function() {
      beforeEach(function() {
        sinon.stub(store, 'persist').returns(RSVP.reject());
      });

      it('is not authenticated', function() {
        return session.authenticate('authenticator').then(() => {
          expect(session.get('isAuthenticated')).to.be.false;
        });
      });
    });
  });

  describe('invalidation', function() {
    beforeEach(function() {
      sinon.stub(authenticator, 'authenticate').returns(RSVP.resolve({ some: 'property' }));
      return session.authenticate('authenticator');
    });

    describe('when invalidate gets called with additional params', function() {
      beforeEach(function() {
        sinon.spy(authenticator, 'invalidate');
      });

      it('passes the params on to the authenticators invalidate method', function() {
        let param = { some: 'random data' };
        session.invalidate(param);
        expect(authenticator.invalidate).to.have.been.calledWith(session.get('authenticated'), param);
      });
    });

    describe('when the authenticator resolves invalidation', function() {
      beforeEach(function() {
        sinon.stub(authenticator, 'invalidate').returns(RSVP.resolve());
      });

      it('is not authenticated', function() {
        return session.invalidate().then(() => {
          expect(session.get('isAuthenticated')).to.be.false;
        });
      });

      it('returns a resolving promise', function() {
        return session.invalidate().then(() => {
          expect(true).to.be.true;
        });
      });

      it('clears its authenticated section', function() {
        session.set('content', { some: 'property', authenticated: { some: 'other property' } });

        return session.invalidate().then(() => {
          expect(session.get('content')).to.eql({ some: 'property', authenticated: {} });
        });
      });

      it('updates the store', function() {
        session.set('content', { some: 'property', authenticated: { some: 'other property' } });

        return session.invalidate().then(() => {
          return store.restore().then((properties) => {
            expect(properties).to.eql({ some: 'property', authenticated: {} });
          });
        });
      });

      it('triggers the "invalidationSucceeded" event', function() {
        let triggered = false;
        session.one('invalidationSucceeded', () => (triggered = true));

        return session.invalidate().then(() => {
          expect(triggered).to.be.true;
        });
      });
    });

    describe('when the authenticator rejects invalidation', function() {
      it('stays authenticated', function() {
        sinon.stub(authenticator, 'invalidate').returns(RSVP.reject('error'));

        return session.invalidate().catch(() => {
          expect(session.get('isAuthenticated')).to.be.true;
        });
      });

      it('returns a rejecting promise', function() {
        sinon.stub(authenticator, 'invalidate').returns(RSVP.reject('error'));

        return session.invalidate().catch(() => {
          expect(true).to.be.true;
        });
      });

      it('keeps its content', function() {
        sinon.stub(authenticator, 'invalidate').returns(RSVP.reject('error'));

        return session.invalidate().catch(() => {
          expect(session.get('authenticated')).to.eql({ some: 'property', authenticator: 'authenticator' });
        });
      });

      it('does not update the store', function() {
        sinon.stub(authenticator, 'invalidate').returns(RSVP.reject('error'));

        return session.invalidate().catch(() => {
          return store.restore().then((properties) => {
            expect(properties).to.eql({ authenticated: { some: 'property', authenticator: 'authenticator' } });
          });
        });
      });

      it('does not trigger the "invalidationSucceeded" event', function() {
        sinon.stub(authenticator, 'invalidate').returns(RSVP.reject('error'));
        let triggered = false;
        session.one('invalidationSucceeded', () => (triggered = true));

        return session.invalidate().catch(() => {
          expect(triggered).to.be.false;
        });
      });

      itHandlesAuthenticatorEvents(function() {});
    });

    describe('when the store rejects persistance', function() {
      beforeEach(function() {
        sinon.stub(store, 'persist').returns(RSVP.reject());
      });

      it('rejects but is not authenticated', function() {
        return session.invalidate().catch(() => {
          expect(session.get('isAuthenticated')).to.be.false;
        });
      });
    });
  });

  describe("when the session's content changes", function() {
    describe('when a single property is set', function() {
      describe('when the property is private (starts with an "_")', function() {
        beforeEach(function() {
          session.set('_some', 'property');
        });

        it('does not persist its content in the store', function() {
          return store.restore().then((properties) => {
            delete properties.authenticator;

            expect(properties).to.eql({});
          });
        });
      });

      describe('when the property is not private (does not start with an "_")', function() {
        beforeEach(function() {
          session.set('some', 'property');
        });

        it('persists its content in the store', function() {
          return store.restore().then((properties) => {
            delete properties.authenticator;

            expect(properties).to.eql({ some: 'property', authenticated: {} });
          });
        });
      });
    });

    describe('when multiple properties are set at once', function() {
      beforeEach(function() {
        session.set('some', 'property');
        session.setProperties({ another: 'property', multiple: 'properties' });
      });

      it('persists its content in the store', function() {
        return store.restore().then((properties) => {
          delete properties.authenticator;

          expect(properties).to.eql({ some: 'property', another: 'property', multiple: 'properties', authenticated: {} });
        });
      });
    });
  });

  describe('when the store triggers the "sessionDataUpdated" event', function() {
    describe('when the session is currently busy', function() {
      beforeEach(function() {
        sinon.stub(store, 'restore').returns(new RSVP.Promise((resolve) => {
          next(() => resolve({ some: 'other property' }));
        }));
      });

      it('does not process the event', function(done) {
        sinon.spy(authenticator, 'restore');
        session.restore().then(done).catch(done);
        store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator' } });

        expect(authenticator.restore).to.not.have.been.called;
      });
    });

    describe('when the session is not currently busy', function() {
      describe('when there is an authenticator factory in the event data', function() {
        describe('when the authenticator resolves restoration', function() {
          beforeEach(function() {
            sinon.stub(authenticator, 'restore').returns(RSVP.resolve({ some: 'other property' }));
          });

          it('is authenticated', function(done) {
            store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator' } });

            next(() => {
              expect(session.get('isAuthenticated')).to.be.true;
              done();
            });
          });

          it('stores the data the authenticator resolves with in its authenticated section', function(done) {
            store.trigger('sessionDataUpdated', { some: 'property', authenticated: { authenticator: 'authenticator' } });

            next(() => {
              expect(session.get('authenticated')).to.eql({ some: 'other property', authenticator: 'authenticator' });
              done();
            });
          });

          it('persists its content in the store', function(done) {
            store.trigger('sessionDataUpdated', { some: 'property', authenticated: { authenticator: 'authenticator' } });

            next(() => {
              store.restore().then((properties) => {

                expect(properties).to.eql({ some: 'property', authenticated: { some: 'other property', authenticator: 'authenticator' } });
                done();
              });
            });
          });

          describe('when the session is already authenticated', function() {
            beforeEach(function() {
              session.set('isAuthenticated', true);
            });

            it('does not trigger the "authenticationSucceeded" event', function(done) {
              let triggered = false;
              session.one('authenticationSucceeded', () => (triggered = true));
              store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator' } });

              next(() => {
                expect(triggered).to.be.false;
                done();
              });
            });
          });

          describe('when the session is not already authenticated', function() {
            beforeEach(function() {
              session.set('isAuthenticated', false);
            });

            it('triggers the "authenticationSucceeded" event', function(done) {
              let triggered = false;
              session.one('authenticationSucceeded', () => (triggered = true));
              store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator' } });

              next(() => {
                expect(triggered).to.be.true;
                done();
              });
            });
          });
        });

        describe('when the authenticator rejects restoration', function() {
          beforeEach(function() {
            sinon.stub(authenticator, 'restore').returns(RSVP.reject());
          });

          it('is not authenticated', function(done) {
            store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator' } });

            next(() => {
              expect(session.get('isAuthenticated')).to.be.false;
              done();
            });
          });

          it('clears its authenticated section', function(done) {
            session.set('content', { some: 'property', authenticated: { some: 'other property' } });
            store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator' } });

            next(() => {
              expect(session.get('content')).to.eql({ some: 'other property', authenticated: {} });
              done();
            });
          });

          it('updates the store', function(done) {
            session.set('content', { some: 'property', authenticated: { some: 'other property' } });
            store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator' } });

            next(() => {
              store.restore().then((properties) => {
                expect(properties).to.eql({ some: 'other property', authenticated: {} });
                done();
              });
            });
          });

          describe('when the session is authenticated', function() {
            beforeEach(function() {
              session.set('isAuthenticated', true);
            });

            it('triggers the "invalidationSucceeded" event', function(done) {
              let triggered = false;
              session.one('invalidationSucceeded', () => (triggered = true));
              store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator' } });

              next(() => {
                expect(triggered).to.be.true;
                done();
              });
            });
          });

          describe('when the session is not authenticated', function() {
            beforeEach(function() {
              session.set('isAuthenticated', false);
            });

            it('does not trigger the "invalidationSucceeded" event', function(done) {
              let triggered = false;
              session.one('invalidationSucceeded', () => (triggered = true));
              store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator' } });

              next(() => {
                expect(triggered).to.be.false;
                done();
              });
            });
          });
        });
      });

      describe('when there is no authenticator factory in the store', function() {
        it('is not authenticated', function(done) {
          store.trigger('sessionDataUpdated', { some: 'other property' });

          next(() => {
            expect(session.get('isAuthenticated')).to.be.false;
            done();
          });
        });

        it('clears its authenticated section', function(done) {
          session.set('content', { some: 'property', authenticated: { some: 'other property' } });
          store.trigger('sessionDataUpdated', { some: 'other property' });

          next(() => {
            expect(session.get('content')).to.eql({ some: 'other property', authenticated: {} });
            done();
          });
        });

        it('updates the store', function(done) {
          session.set('content', { some: 'property', authenticated: { some: 'other property' } });
          store.trigger('sessionDataUpdated', { some: 'other property' });

          next(() => {
            store.restore().then((properties) => {
              expect(properties).to.eql({ some: 'other property', authenticated: {} });
              done();
            });
          });
        });

        describe('when the session is authenticated', function() {
          beforeEach(function() {
            session.set('isAuthenticated', true);
          });

          it('triggers the "invalidationSucceeded" event', function(done) {
            let triggered = false;
            session.one('invalidationSucceeded', () => (triggered = true));
            store.trigger('sessionDataUpdated', { some: 'other property' });

            next(() => {
              expect(triggered).to.be.true;
              done();
            });
          });
        });

        describe('when the session is not authenticated', function() {
          beforeEach(function() {
            session.set('isAuthenticated', false);
          });

          it('does not trigger the "invalidationSucceeded" event', function(done) {
            let triggered = false;
            session.one('invalidationSucceeded', () => (triggered = true));
            store.trigger('sessionDataUpdated', { some: 'other property' });

            next(() => {
              expect(triggered).to.be.false;
              done();
            });
          });

          it('it does not trigger the "sessionInvalidationFailed" event', function() {
            let triggered = false;
            session.one('sessionInvalidationFailed', () => (triggered = true));

            return session.invalidate().then(() => {
              expect(triggered).to.be.false;
            });
          });

          it('it returns with a resolved Promise', function() {
            return session.invalidate().then(() => {
              expect(true).to.be.true;
            });
          });
        });
      });
    });
  });

  it('does not share the content object between multiple instances', function() {
    let session2 = createWithContainer(InternalSession, { store }, container);

    expect(session2.get('content')).to.not.equal(session.get('content'));
  });
});
