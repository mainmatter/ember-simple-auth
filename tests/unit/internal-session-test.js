/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import InternalSession from 'ember-simple-auth/internal-session';
import EphemeralStore from 'ember-simple-auth/session-stores/ephemeral';
import Authenticator from 'ember-simple-auth/authenticators/base';

const { RSVP, K, run: { next } } = Ember;

describe('InternalSession', () => {
  let session;
  let store;
  let authenticator;
  let container;

  beforeEach(() => {
    container     = { lookup() {} };
    store         = EphemeralStore.create();
    authenticator = Authenticator.create();
    session       = InternalSession.create({ store, container });
    sinon.stub(container, 'lookup').withArgs('authenticator').returns(authenticator);
  });

  it('does not allow data to be stored for the key "authenticated"', () => {
    expect(() => {
      session.set('authenticated', 'test');
    }).to.throw(Error);
  });

  function itHandlesAuthenticatorEvents(preparation) {
    describe('when the authenticator triggers the "sessionDataUpdated" event', () => {
      beforeEach(() => {
        return preparation.call();
      });

      it('stores the data the event is triggered with in its authenticated section', (done) => {
        authenticator.trigger('sessionDataUpdated', { some: 'property' });

        next(() => {
          expect(session.get('authenticated')).to.eql({ some: 'property', authenticator: 'authenticator' });
          done();
        });
      });
    });

    describe('when the authenticator triggers the "invalidated" event', () => {
      beforeEach(() => {
        return preparation.call();
      });

      it('is not authenticated', (done) => {
        authenticator.trigger('sessionDataInvalidated');

        next(() => {
          expect(session.get('isAuthenticated')).to.be.false;
          done();
        });
      });

      it('clears its authenticated section', (done) => {
        session.set('content', { some: 'property', authenticated: { some: 'other property' } });
        authenticator.trigger('sessionDataInvalidated');

        next(() => {
          expect(session.get('content')).to.eql({ some: 'property', authenticated: {} });
          done();
        });
      });

      it('updates the store', (done) => {
        authenticator.trigger('sessionDataInvalidated');

        next(() => {
          store.restore().then((properties) => {
            expect(properties.authenticated).to.eql({});
            done();
          });
        });
      });

      it('triggers the "invalidationSucceeded" event', (done) => {
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

  describe('restore', () => {
    function itDoesNotRestore() {
      it('returns a rejecting promise', () => {
        return session.restore().catch(() => {
          expect(true).to.be.true;
        });
      });

      it('is not authenticated', () => {
        return session.restore().catch(() => {
          expect(session.get('isAuthenticated')).to.be.false;
        });
      });

      it('clears its authenticated section', () => {
        store.persist({ some: 'property', authenticated: { some: 'other property' } });

        return session.restore().catch(() => {
          expect(session.get('content')).to.eql({ some: 'property', authenticated: {} });
        });
      });
    }

    describe('when the restored data contains an authenticator factory', () => {
      beforeEach(() => {
        store.persist({ authenticated: { authenticator: 'authenticator' } });
      });

      describe('when the authenticator resolves restoration', () => {
        beforeEach(() => {
          sinon.stub(authenticator, 'restore').returns(RSVP.resolve({ some: 'property' }));
        });

        it('returns a resolving promise', () => {
          return session.restore().then(() => {
            expect(true).to.be.true;
          });
        });

        it('is authenticated', () => {
          return session.restore().then(() => {
            expect(session.get('isAuthenticated')).to.be.true;
          });
        });

        it('stores the data the authenticator resolves with in its authenticated section', () => {
          return store.persist({ authenticated: { authenticator: 'authenticator' } }).then(() => {
            return session.restore().then(() => {
              return store.restore().then((properties) => {
                delete properties.authenticator;

                expect(session.get('authenticated')).to.eql({ some: 'property', authenticator: 'authenticator' });
              });
            });
          });
        });

        it('persists its content in the store', () => {
          return store.persist({ authenticated: { authenticator: 'authenticator' }, someOther: 'property' }).then(() => {
            return session.restore().then(() => {
              return store.restore().then((properties) => {
                delete properties.authenticator;

                expect(properties).to.eql({ authenticated: { some: 'property', authenticator: 'authenticator' }, someOther: 'property' });
              });
            });
          });
        });

        it('persists the authenticator factory in the store', () => {
          return session.restore().then(() => {
            return store.restore().then((properties) => {
              expect(properties.authenticated.authenticator).to.eql('authenticator');
            });
          });
        });

        it('does not trigger the "authenticationSucceeded" event', () => {
          let triggered = false;
          session.one('authenticationSucceeded', () => triggered = true);

          return session.restore().then(() => {
            expect(triggered).to.be.false;
          });
        });

        itHandlesAuthenticatorEvents(() => {
          return session.restore();
        });
      });

      describe('when the authenticator rejects restoration', () => {
        beforeEach(() => {
          sinon.stub(authenticator, 'restore').returns(RSVP.reject());
        });

        itDoesNotRestore();
      });
    });

    describe('when the restored data does not contain an authenticator factory', () => {
      itDoesNotRestore();
    });

    describe('when the store rejects restoration', function() {
      beforeEach(() => {
        sinon.stub(store, 'restore').returns(RSVP.Promise.reject());
      });

      it('is not authenticated', () => {
        return session.restore().then(() => {
          expect(session.get('isAuthenticated')).to.be.false;
        });
      });
    });

    describe('when the store rejects persistance', () => {
      beforeEach(() => {
        sinon.stub(store, 'persist').returns(RSVP.reject());
      });

      it('is not authenticated', () => {
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
          beforeEach(() => {
            sinon.stub(store, 'restore').returns({ authenticated: { authenticator: 'authenticator' } });
          });

          it('is authenticated', () => {
            return session.restore().then(() => {
              expect(session.get('isAuthenticated')).to.be.true;
            });
          });
        });

        describe('when the store rejects restoration', function() {
          beforeEach(() => {
            sinon.stub(store, 'restore').returns({});
          });

          it('is not authenticated', () => {
            return session.restore().then(() => {
              expect(session.get('isAuthenticated')).to.be.false;
            });
          });
        });
      });
    });
  });

  describe('authentication', () => {
    describe('when the authenticator resolves authentication', () => {
      beforeEach(() => {
        sinon.stub(authenticator, 'authenticate').returns(RSVP.resolve({ some: 'property' }));
      });

      it('is authenticated', () => {
        return session.authenticate('authenticator').then(() => {
          expect(session.get('isAuthenticated')).to.be.true;
        });
      });

      it('returns a resolving promise', () => {
        return session.authenticate('authenticator').then(() => {
          expect(true).to.be.true;
        });
      });

      it('stores the data the authenticator resolves with in its authenticated section', () => {
        return session.authenticate('authenticator').then(() => {
          expect(session.get('authenticated')).to.eql({ some: 'property', authenticator: 'authenticator' });
        });
      });

      it('persists its content in the store', () => {
        return session.authenticate('authenticator').then(() => {
          return store.restore().then((properties) => {
            delete properties.authenticator;

            expect(properties).to.eql({ authenticated: { some: 'property', authenticator: 'authenticator' } });
          });
        });
      });

      it('persists the authenticator factory in the store', () => {
        return session.authenticate('authenticator').then(() => {
          return store.restore().then((properties) => {
            expect(properties.authenticated.authenticator).to.eql('authenticator');
          });
        });
      });

      it('triggers the "authenticationSucceeded" event', () => {
        let triggered = false;
        session.one('authenticationSucceeded', () => triggered = true);

        return session.authenticate('authenticator').then(() => {
          expect(triggered).to.be.true;
        });
      });

      itHandlesAuthenticatorEvents(() => {
        return session.authenticate('authenticator');
      });
    });

    describe('when the authenticator rejects authentication', () => {
      it('is not authenticated', () => {
        sinon.stub(authenticator, 'authenticate').returns(RSVP.reject('error auth'));

        return session.authenticate('authenticator').catch(() => {
          expect(session.get('isAuthenticated')).to.be.false;
        });
      });

      it('returns a rejecting promise', () => {
        sinon.stub(authenticator, 'authenticate').returns(RSVP.reject('error auth'));

        return session.authenticate('authenticator').catch(() => {
          expect(true).to.be.true;
        });
      });

      it('clears its authenticated section', () => {
        sinon.stub(authenticator, 'authenticate').returns(RSVP.reject('error auth'));
        session.set('content', { some: 'property', authenticated: { some: 'other property' } });

        return session.authenticate('authenticator').catch(() => {
          expect(session.get('content')).to.eql({ some: 'property', authenticated: {} });
        });
      });

      it('updates the store', () => {
        sinon.stub(authenticator, 'authenticate').returns(RSVP.reject('error auth'));
        session.set('content', { some: 'property', authenticated: { some: 'other property' } });

        return session.authenticate('authenticator').catch(() => {
          return store.restore().then((properties) => {
            expect(properties).to.eql({ some: 'property', authenticated: {} });
          });
        });
      });

      it('does not trigger the "authenticationSucceeded" event', () => {
        let triggered = false;
        sinon.stub(authenticator, 'authenticate').returns(RSVP.reject('error auth'));
        session.one('authenticationSucceeded', () => triggered = true);

        return session.authenticate('authenticator').catch(() => {
          expect(triggered).to.be.false;
        });
      });
    });

    describe('when the store rejects persistance', () => {
      beforeEach(() => {
        sinon.stub(store, 'persist').returns(RSVP.reject());
      });

      it('is not authenticated', () => {
        return session.authenticate('authenticator').then(() => {
          expect(session.get('isAuthenticated')).to.be.false;
        });
      });
    });
  });

  describe('invalidation', () => {
    beforeEach(() => {
      sinon.stub(authenticator, 'authenticate').returns(RSVP.resolve({ some: 'property' }));
      return session.authenticate('authenticator');
    });

    describe('when the authenticator resolves invaldiation', () => {
      beforeEach(() => {
        sinon.stub(authenticator, 'invalidate').returns(RSVP.resolve());
      });

      it('is not authenticated', () => {
        return session.invalidate().then(() => {
          expect(session.get('isAuthenticated')).to.be.false;
        });
      });

      it('returns a resolving promise', () => {
        return session.invalidate().then(() => {
          expect(true).to.be.true;
        });
      });

      it('clears its authenticated section', () => {
        session.set('content', { some: 'property', authenticated: { some: 'other property' } });

        return session.invalidate().then(() => {
          expect(session.get('content')).to.eql({ some: 'property', authenticated: {} });
        });
      });

      it('updates the store', () => {
        session.set('content', { some: 'property', authenticated: { some: 'other property' } });

        return session.invalidate().then(() => {
          return store.restore().then((properties) => {
            expect(properties).to.eql({ some: 'property', authenticated: {} });
          });
        });
      });

      it('triggers the "invalidationSucceeded" event', () => {
        let triggered = false;
        session.one('invalidationSucceeded', () => triggered = true);

        return session.invalidate().then(() => {
          expect(triggered).to.be.true;
        });
      });
    });

    describe('when the authenticator rejects invalidation', () => {
      it('stays authenticated', () => {
        sinon.stub(authenticator, 'invalidate').returns(RSVP.reject('error'));

        return session.invalidate().catch(() => {
          expect(session.get('isAuthenticated')).to.be.true;
        });
      });

      it('returns a rejecting promise', () => {
        sinon.stub(authenticator, 'invalidate').returns(RSVP.reject('error'));

        return session.invalidate().catch(() => {
          expect(true).to.be.true;
        });
      });

      it('keeps its content', () => {
        sinon.stub(authenticator, 'invalidate').returns(RSVP.reject('error'));

        return session.invalidate().catch(() => {
          expect(session.get('authenticated')).to.eql({ some: 'property', authenticator: 'authenticator' });
        });
      });

      it('does not update the store', () => {
        sinon.stub(authenticator, 'invalidate').returns(RSVP.reject('error'));

        return session.invalidate().catch(() => {
          return store.restore().then((properties) => {
            expect(properties).to.eql({ authenticated: { some: 'property', authenticator: 'authenticator' } });
          });
        });
      });

      it('does not trigger the "invalidationSucceeded" event', () => {
        sinon.stub(authenticator, 'invalidate').returns(RSVP.reject('error'));
        let triggered = false;
        session.one('invalidationSucceeded', () => triggered = true);

        return session.invalidate().catch(() => {
          expect(triggered).to.be.false;
        });
      });

      itHandlesAuthenticatorEvents(K);
    });

    describe('when the store rejects persistance', () => {
      beforeEach(() => {
        sinon.stub(store, 'persist').returns(RSVP.reject());
      });

      it('rejects but is not authenticated', () => {
        return session.invalidate().catch(() => {
          expect(session.get('isAuthenticated')).to.be.false;
        });
      });
    });
  });

  describe("when the session's content changes", () => {
    describe('when a single property is set', () => {
      beforeEach(() => {
        session.set('some', 'property');
      });

      it('persists its content in the store', () => {
        return store.restore().then((properties) => {
          delete properties.authenticator;

          expect(properties).to.eql({ some: 'property', authenticated: {} });
        });
      });
    });

    describe('when multiple properties are set at once', () => {
      beforeEach(() => {
        session.set('some', 'property');
        session.setProperties({ multiple: 'properties' });
      });

      it('persists its content in the store', () => {
        return store.restore().then((properties) => {
          delete properties.authenticator;

          expect(properties).to.eql({ some: 'property', multiple: 'properties', authenticated: {} });
        });
      });
    });
  });

  describe('when the store triggers the "sessionDataUpdated" event', () => {
    describe('when the session is currently busy', () => {
      beforeEach(() => {
        sinon.stub(store, 'restore').returns(new RSVP.Promise((resolve) => {
          next(() => resolve({ some: 'other property' }));
        }));
      });

      it('does not process the event', (done) => {
        sinon.spy(authenticator, 'restore');
        session.restore().then(done).catch(done);
        store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator' } });

        expect(authenticator.restore).to.not.have.been.called;
      });
    });

    describe('when the session is not currently busy', () => {
      describe('when there is an authenticator factory in the event data', () => {
        describe('when the authenticator resolves restoration', () => {
          beforeEach(() => {
            sinon.stub(authenticator, 'restore').returns(RSVP.resolve({ some: 'other property' }));
          });

          it('is authenticated', (done) => {
            store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator' } });

            next(() => {
              expect(session.get('isAuthenticated')).to.be.true;
              done();
            });
          });

          it('stores the data the authenticator resolves with in its authenticated section', (done) => {
            store.trigger('sessionDataUpdated', { some: 'property', authenticated: { authenticator: 'authenticator' } });

            next(() => {
              expect(session.get('authenticated')).to.eql({ some: 'other property', authenticator: 'authenticator' });
              done();
            });
          });

          it('persists its content in the store', (done) => {
            store.trigger('sessionDataUpdated', { some: 'property', authenticated: { authenticator: 'authenticator' } });

            next(() => {
              store.restore().then((properties) => {

                expect(properties).to.eql({ some: 'property', authenticated: { some: 'other property', authenticator: 'authenticator' } });
                done();
              });
            });
          });

          describe('when the session is already authenticated', () => {
            beforeEach(() => {
              session.set('isAuthenticated', true);
            });

            it('does not trigger the "authenticationSucceeded" event', (done) => {
              let triggered = false;
              session.one('authenticationSucceeded', () => triggered = true);
              store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator' } });

              next(() => {
                expect(triggered).to.be.false;
                done();
              });
            });
          });

          describe('when the session is not already authenticated', () => {
            beforeEach(() => {
              session.set('isAuthenticated', false);
            });

            it('triggers the "authenticationSucceeded" event', (done) => {
              let triggered = false;
              session.one('authenticationSucceeded', () => triggered = true);
              store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator' } });

              next(() => {
                expect(triggered).to.be.true;
                done();
              });
            });
          });
        });

        describe('when the authenticator rejects restoration', () => {
          beforeEach(() => {
            sinon.stub(authenticator, 'restore').returns(RSVP.reject());
          });

          it('is not authenticated', (done) => {
            store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator' } });

            next(() => {
              expect(session.get('isAuthenticated')).to.be.false;
              done();
            });
          });

          it('clears its authenticated section', (done) => {
            session.set('content', { some: 'property', authenticated: { some: 'other property' } });
            store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator' } });

            next(() => {
              expect(session.get('content')).to.eql({ some: 'other property', authenticated: {} });
              done();
            });
          });

          it('updates the store', (done) => {
            session.set('content', { some: 'property', authenticated: { some: 'other property' } });
            store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator' } });

            next(() => {
              store.restore().then((properties) => {
                expect(properties).to.eql({ some: 'other property', authenticated: {} });
                done();
              });
            });
          });

          describe('when the session is authenticated', () => {
            beforeEach(() => {
              session.set('isAuthenticated', true);
            });

            it('triggers the "invalidationSucceeded" event', (done) => {
              let triggered = false;
              session.one('invalidationSucceeded', () => triggered = true);
              store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator' } });

              next(() => {
                expect(triggered).to.be.true;
                done();
              });
            });
          });

          describe('when the session is not authenticated', () => {
            beforeEach(() => {
              session.set('isAuthenticated', false);
            });

            it('does not trigger the "invalidationSucceeded" event', (done) => {
              let triggered = false;
              session.one('invalidationSucceeded', () => triggered = true);
              store.trigger('sessionDataUpdated', { some: 'other property', authenticated: { authenticator: 'authenticator' } });

              next(() => {
                expect(triggered).to.be.false;
                done();
              });
            });
          });
        });
      });

      describe('when there is no authenticator factory in the store', () => {
        it('is not authenticated', (done) => {
          store.trigger('sessionDataUpdated', { some: 'other property' });

          next(() => {
            expect(session.get('isAuthenticated')).to.be.false;
            done();
          });
        });

        it('clears its authenticated section', (done) => {
          session.set('content', { some: 'property', authenticated: { some: 'other property' } });
          store.trigger('sessionDataUpdated', { some: 'other property' });

          next(() => {
            expect(session.get('content')).to.eql({ some: 'other property', authenticated: {} });
            done();
          });
        });

        it('updates the store', (done) => {
          session.set('content', { some: 'property', authenticated: { some: 'other property' } });
          store.trigger('sessionDataUpdated', { some: 'other property' });

          next(() => {
            store.restore().then((properties) => {
              expect(properties).to.eql({ some: 'other property', authenticated: {} });
              done();
            });
          });
        });

        describe('when the session is authenticated', () => {
          beforeEach(() => {
            session.set('isAuthenticated', true);
          });

          it('triggers the "invalidationSucceeded" event', (done) => {
            let triggered = false;
            session.one('invalidationSucceeded', () => triggered = true);
            store.trigger('sessionDataUpdated', { some: 'other property' });

            next(() => {
              expect(triggered).to.be.true;
              done();
            });
          });
        });

        describe('when the session is not authenticated', () => {
          beforeEach(() => {
            session.set('isAuthenticated', false);
          });

          it('does not trigger the "invalidationSucceeded" event', (done) => {
            let triggered = false;
            session.one('invalidationSucceeded', () => triggered = true);
            store.trigger('sessionDataUpdated', { some: 'other property' });

            next(() => {
              expect(triggered).to.be.false;
              done();
            });
          });
        });
      });
    });
  });

  it('does not share the content object between multiple instances', () => {
    let session2 = InternalSession.create({ store, container });

    expect(session2.get('content')).to.not.equal(session.get('content'));
  });
});
