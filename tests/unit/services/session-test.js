/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import Session from 'ember-simple-auth/services/session';

describe('SessionService', () => {
  let sessionService;
  let session;
  let authorizer;

  beforeEach(() => {
    session = Ember.Object.extend(Ember.Evented, {
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

    Ember.run.next(() => {
      expect(triggered).to.be.true;
      done();
    });
  });

  it('forwards the "invalidationSucceeded" event from the session', (done) => {
    let triggered = false;
    sessionService.one('invalidationSucceeded', () => triggered = true);
    session.trigger('invalidationSucceeded');

    Ember.run.next(() => {
      expect(triggered).to.be.true;
      done();
    });
  });

  describe('isAuthenticated', () => {
    it('is read from the session', () => {
      session.isAuthenticated = true;

      expect(sessionService.get('isAuthenticated')).to.be.true;
    });

    it('is read-only', () => {
      expect(() => {
        sessionService.set('isAuthenticated', false);
      }).to.throw;
    });
  });

  describe('data', () => {
    it("is read from the session's content", () => {
      session.content = { some: 'data' };

      expect(sessionService.get('data')).to.eql({ some: 'data' });
    });

    it("is written back to the session's content", () => {
      sessionService.set('data.some', { other: 'data' });

      expect(session.content).to.eql({ some: { other: 'data' } });
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
    it('authorizes with the authorizer', () => {
      sinon.spy(authorizer, 'authorize');
      sessionService.authorize('authorizer', 'block');

      expect(authorizer.authorize).to.have.been.calledWith('block');
    });
  });
});
