/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import Session from 'ember-simple-auth/services/session';

const { ObjectProxy, Evented, run: { next }, set } = Ember;

describe('SessionService', () => {
  let sessionService;
  let session;
  let authorizer;

  beforeEach(() => {
    session = ObjectProxy.extend(Evented, {
      content: {}
    }).create();
    authorizer = {
      authorize() {}
    };
    let container = { lookup() {} };
    sinon.stub(container, 'lookup').withArgs('authorizer').returns(authorizer);
    sessionService = Session.create({ container, session });
  });

  it('forwards the "authenticationSucceeded" event from the session', (done) => {
    let triggered = false;
    sessionService.one('authenticationSucceeded', () => triggered = true);
    session.trigger('authenticationSucceeded');

    next(() => {
      expect(triggered).to.be.true;
      done();
    });
  });

  it('forwards the "invalidationSucceeded" event from the session', (done) => {
    let triggered = false;
    sessionService.one('invalidationSucceeded', () => triggered = true);
    session.trigger('invalidationSucceeded');

    next(() => {
      expect(triggered).to.be.true;
      done();
    });
  });

  describe('isAuthenticated', () => {
    it('is read from the session', () => {
      session.set('isAuthenticated', true);

      expect(sessionService.get('isAuthenticated')).to.be.true;
    });

    it('is read-only', () => {
      expect(() => {
        sessionService.set('isAuthenticated', false);
      }).to.throw;
    });
  });

  describe('store', () => {
    it('is read from the session', () => {
      session.set('store', 'some store');

      expect(sessionService.get('store')).to.eq('some store');
    });

    it('is read-only', () => {
      expect(() => {
        sessionService.set('store', 'some other store');
      }).to.throw;
    });
  });

  describe('attemptedTransition', () => {
    it('is read from the session', () => {
      session.set('attemptedTransition', 'some transition');

      expect(sessionService.get('attemptedTransition')).to.eq('some transition');
    });

    it('is written back to the session', () => {
      sessionService.set('attemptedTransition', 'some other transition');

      expect(session.get('attemptedTransition')).to.eq('some other transition');
    });
  });

  describe('data', () => {
    it("is read from the session's content", () => {
      session.set('some', 'data');

      expect(sessionService.get('data')).to.eql({ some: 'data' });
    });

    it("is written back to the session's content", () => {
      sessionService.set('data.some', { other: 'data' });

      expect(session.content).to.eql({ some: { other: 'data' } });
    });

    it('can be set with Ember.set', () => {
      set(sessionService, 'data.emberSet', 'ember-set-data');

      expect(session.content).to.eql({ emberSet: 'ember-set-data' });
    });

    it('is read-only', () => {
      expect(() => {
        sessionService.set('data', false);
      }).to.throw;
    });
  });

  describe('authenticate', () => {
    beforeEach(() => {
      session.reopen({
        authenticate() {
          return 'value';
        }
      });
    });

    it('authenticates the session', () => {
      sinon.spy(session, 'authenticate');
      sessionService.authenticate({ some: 'argument' });

      expect(session.authenticate).to.have.been.calledWith({ some: 'argument' });
    });

    it("returns the session's authentication return value", () => {
      expect(sessionService.authenticate()).to.eq('value');
    });
  });

  describe('invalidate', () => {
    beforeEach(() => {
      session.reopen({
        invalidate() {
          return 'value';
        }
      });
    });

    it('invalidates the session', () => {
      sinon.spy(session, 'invalidate');
      sessionService.invalidate({ some: 'argument' });

      expect(session.invalidate).to.have.been.calledWith({ some: 'argument' });
    });

    it("returns the session's invalidation return value", () => {
      expect(sessionService.invalidate()).to.eq('value');
    });
  });

  describe('authorize', () => {
    describe('when the session is authenticated', () => {
      beforeEach(() => {
        sessionService.set('isAuthenticated', true);
        sessionService.set('data', { authenticated: { some: 'data' } });
      });

      it('authorizes with the authorizer', () => {
        sinon.spy(authorizer, 'authorize');
        sessionService.authorize('authorizer', 'block');

        expect(authorizer.authorize).to.have.been.calledWith({ some: 'data' }, 'block');
      });
    });

    describe('when the session is not authenticated', () => {
      beforeEach(() => {
        sessionService.set('isAuthenticated', false);
      });

      it('does not authorize', () => {
        sinon.spy(authorizer, 'authorize');
        sessionService.authorize('authorizer', 'block');

        expect(authorizer.authorize).to.not.have.been.called;
      });
    });
  });
});
