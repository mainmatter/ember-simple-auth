import ObjectProxy from '@ember/object/proxy';
import { setOwner } from '@ember/application';
import Evented from '@ember/object/evented';
import { next } from '@ember/runloop';
import EmberObject, { set } from '@ember/object';
import { describe, beforeEach, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import { expect } from 'chai';
import sinonjs from 'sinon';
import Session from 'ember-simple-auth/services/session';

describe('SessionService', () => {
  setupTest();

  let sinon;
  let sessionService;
  let session;

  beforeEach(function() {
    sinon = sinonjs.createSandbox();
    session = ObjectProxy.extend(Evented, {
      init() {
        this._super(...arguments);
        this.content = {};
      }
    }).create();

    this.owner.register('authorizer:custom', EmberObject.extend({
      authorize() {}
    }));
    sessionService = Session.create({ session });
    setOwner(sessionService, this.owner);
  });

  afterEach(function() {
    sinon.restore();
  });

  it('forwards the "authenticationSucceeded" event from the session', function(done) {
    let triggered = false;
    sessionService.one('authenticationSucceeded', () => (triggered = true));
    session.trigger('authenticationSucceeded');

    next(() => {
      expect(triggered).to.be.true;
      done();
    });
  });

  it('forwards the "invalidationSucceeded" event from the session', function(done) {
    let triggered = false;
    sessionService.one('invalidationSucceeded', () => (triggered = true));
    session.trigger('invalidationSucceeded');

    next(() => {
      expect(triggered).to.be.true;
      done();
    });
  });

  describe('isAuthenticated', function() {
    it('is read from the session', function() {
      session.set('isAuthenticated', true);

      expect(sessionService.get('isAuthenticated')).to.be.true;
    });

    it('is read-only', function() {
      expect(() => {
        sessionService.set('isAuthenticated', false);
      }).to.throw;
    });
  });

  describe('store', function() {
    it('is read from the session', function() {
      session.set('store', 'some store');

      expect(sessionService.get('store')).to.eq('some store');
    });

    it('is read-only', function() {
      expect(() => {
        sessionService.set('store', 'some other store');
      }).to.throw;
    });
  });

  describe('attemptedTransition', function() {
    it('is read from the session', function() {
      session.set('attemptedTransition', 'some transition');

      expect(sessionService.get('attemptedTransition')).to.eq('some transition');
    });

    it('is written back to the session', function() {
      sessionService.set('attemptedTransition', 'some other transition');

      expect(session.get('attemptedTransition')).to.eq('some other transition');
    });
  });

  describe('data', function() {
    it("is read from the session's content", function() {
      session.set('some', 'data');

      expect(sessionService.get('data')).to.eql({ some: 'data' });
    });

    it("is written back to the session's content", function() {
      sessionService.set('data.some', { other: 'data' });

      expect(session.content).to.eql({ some: { other: 'data' } });
    });

    it('can be set with Ember.set', function() {
      set(sessionService, 'data.emberSet', 'ember-set-data');

      expect(session.content).to.eql({ emberSet: 'ember-set-data' });
    });

    it('is read-only', function() {
      expect(() => {
        sessionService.set('data', false);
      }).to.throw;
    });
  });

  describe('authenticate', function() {
    beforeEach(function() {
      session.reopen({
        authenticate() {
          return 'value';
        }
      });
    });

    it('authenticates the session', function() {
      sinon.spy(session, 'authenticate');
      sessionService.authenticate({ some: 'argument' });

      expect(session.authenticate).to.have.been.calledWith({ some: 'argument' });
    });

    it("returns the session's authentication return value", function() {
      expect(sessionService.authenticate()).to.eq('value');
    });
  });

  describe('invalidate', function() {
    beforeEach(function() {
      session.reopen({
        invalidate() {
          return 'value';
        }
      });
    });

    it('invalidates the session', function() {
      sinon.spy(session, 'invalidate');
      sessionService.invalidate({ some: 'argument' });

      expect(session.invalidate).to.have.been.calledWith({ some: 'argument' });
    });

    it("returns the session's invalidation return value", function() {
      expect(sessionService.invalidate()).to.eq('value');
    });
  });
});
