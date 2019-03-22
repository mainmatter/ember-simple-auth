import ObjectProxy from '@ember/object/proxy';
import Evented from '@ember/object/evented';
import { next } from '@ember/runloop';
import { set } from '@ember/object';
import { registerDeprecationHandler } from '@ember/debug';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinonjs from 'sinon';
import Session from 'ember-simple-auth/services/session';

import createWithContainer from '../../helpers/create-with-container';

describe('SessionService', () => {
  let sinon;
  let sessionService;
  let session;
  let authorizer;

  beforeEach(function() {
    sinon = sinonjs.sandbox.create();
    session = ObjectProxy.extend(Evented, {
      content: {}
    }).create();
    authorizer = {
      authorize() {}
    };
    let container = { lookup() {} };
    let stub = sinon.stub(container, 'lookup');
    stub.withArgs('authorizer').returns(authorizer);
    stub.withArgs('bad-authorizer').returns(undefined);
    sessionService = createWithContainer(Session, { session }, container);
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

  describe('authorize', function() {
    describe('when the session is authenticated', function() {
      beforeEach(function() {
        sessionService.set('isAuthenticated', true);
        sessionService.set('data', { authenticated: { some: 'data' } });
      });

      it('authorizes with the authorizer', function() {
        sinon.spy(authorizer, 'authorize');
        sessionService.authorize('authorizer', 'block');

        expect(authorizer.authorize).to.have.been.calledWith({ some: 'data' }, 'block');
      });

      it("throws an error when the authorizer doesn't exist", function() {
        expect(() => {
          sessionService.authorize('bad-authorizer', 'block');
        }).to.throw(Error, /No authorizer for factory/);
      });

      it("shows deprecation warning when 'authorize' is called", function() {
        let warnings = [];
        registerDeprecationHandler((message, options, next) => {
          // in case a deprecation is issued before a test is started
          if (!warnings) {
            warnings = [];
          }

          warnings.push(message);
          next(message, options);
        });

        sessionService.authorize('authorizer', 'block');
        expect(warnings).to.have.length(1);
        expect(warnings[0]).to.equal("Ember Simple Auth: 'authorize' is deprecated.");
      });
    });

    describe('when the session is not authenticated', function() {
      beforeEach(function() {
        sessionService.set('isAuthenticated', false);
      });

      it('does not authorize', function() {
        sinon.spy(authorizer, 'authorize');
        sessionService.authorize('authorizer', 'block');

        expect(authorizer.authorize).to.not.have.been.called;
      });
    });
  });
});
