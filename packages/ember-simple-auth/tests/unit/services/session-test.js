import ObjectProxy from '@ember/object/proxy';
import Service from '@ember/service';
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
    this.owner.register('service:session', sessionService, { instantiate: false });
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

  describe('requireAuthentication', function() {
    let transition;
    let router;

    beforeEach(function() {
      transition = {
        intent: {
          url: '/transition/target/url'
        },
        send() {}
      };
      this.owner.register('service:router', Service.extend({
        transitionTo() {}
      }));
      router = this.owner.lookup('service:router');

      sinon.spy(transition, 'send');
      sinon.spy(router, 'transitionTo');
    });

    describe('if the session is authenticated', function() {
      beforeEach(function() {
        session.set('isAuthenticated', true);
      });

      it('returns true', function() {
        let result = sessionService.requireAuthentication(transition, 'login');

        expect(result).to.be.true;
      });

      describe('if a route name is passed as second argument', function() {
        it('does not transition to the authentication route', function() {
          sessionService.requireAuthentication(transition, 'login');

          expect(router.transitionTo).to.not.have.been.calledWith('login');
        });
      });

      describe('if a callback function is passed as second argument', function() {
        it('does not invoke the callback', function() {
          let callback = sinon.spy();
          sessionService.requireAuthentication(transition, callback);

          expect(callback).to.not.have.been.called;
        });
      });
    });

    describe('if the session is not authenticated', function() {
      beforeEach(function() {
        session.set('isAuthenticated', false);
      });

      it('returns false', function() {
        let result = sessionService.requireAuthentication(transition, 'login');

        expect(result).to.be.false;
      });

      describe('if a route name is passed as second argument', function() {
        it('transitions to the specified route', function() {
          sessionService.requireAuthentication(transition, 'login');

          expect(router.transitionTo).to.have.been.calledWith('login');
        });
      });

      describe('if a callback function is passed as second argument', function() {
        it('does invokes the callback', function() {
          let callback = sinon.spy();
          sessionService.requireAuthentication(transition, callback);

          expect(callback).to.have.been.calledOnce;
        });
      });

      describe('if a transition is passed', function() {
        it('stores it in the session', function() {
          sessionService.requireAuthentication(transition, 'login');

          expect(sessionService.get('attemptedTransition')).to.eq(transition);
        });

        it('sets the redirectTarget cookie in fastboot', function() {
          this.owner.register('service:fastboot', Service.extend({
            isFastBoot: true,
            init() {
              this._super(...arguments);
              this.request = {
                protocol: 'https'
              };
            },
          }));
          let writeCookieStub = sinon.stub();
          this.owner.register('service:cookies', Service.extend({
            write: writeCookieStub
          }));

          let cookieName = 'ember_simple_auth-redirectTarget';

          sessionService.requireAuthentication(transition, 'login');

          expect(writeCookieStub).to.have.been.calledWith(cookieName, transition.intent.url, {
            path: '/',
            secure: true
          });
        });
      });

      describe('if no transition is passed', function() {
        it("does not set the session's 'attemptedTransition' property", function() {
          sessionService.requireAuthentication(null, 'login');

          expect(sessionService.get('attemptedTransition')).to.be.undefined;
        });

        it('does not set the redirectTarget cookie in fastboot', function() {
          this.owner.register('service:fastboot', Service.extend({
            isFastBoot: true,
            init() {
              this._super(...arguments);
              this.request = {
                protocol: 'https'
              };
            },
          }));
          let writeCookieStub = sinon.stub();
          this.owner.register('service:cookies', Service.extend({
            write: writeCookieStub
          }));

          sessionService.requireAuthentication(null, 'login');

          expect(writeCookieStub).to.not.have.been.called;
        });
      });
    });
  });
});
