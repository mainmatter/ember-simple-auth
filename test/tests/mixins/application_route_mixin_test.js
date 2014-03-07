import { ApplicationRouteMixin } from 'ember-simple-auth/mixins/application_route_mixin';
import { Session } from 'ember-simple-auth/session';
import { Ephemeral as EphemeralStore } from 'ember-simple-auth/stores/ephemeral';
import { Configuration } from 'ember-simple-auth/core';

var TestRoute = Ember.Route.extend(ApplicationRouteMixin);

describe('ApplicationRouteMixin', function() {
  beforeEach(function() {
    this.session = Session.create({ store: EphemeralStore.create() });
    this.route   = Ember.Route.extend(ApplicationRouteMixin, {
      send: function() {},
      transitionTo: function() {}
    }).create({ session: this.session });
  });

  describe('session events', function() {
    beforeEach(function() {
      this.route.activate();
      sinon.spy(this.route, 'send');
    });

    it('handles the "ember-simple-auth:session-authentication-succeeded" of the session', function(done) {
      this.session.trigger('ember-simple-auth:session-authentication-succeeded');

      Ember.run.next(this, function() {
        expect(this.route.send).to.have.been.calledWith('sessionAuthenticationSucceeded');
        done();
      });
    });

    it('handles the "ember-simple-auth:session-authentication-failed" of the session', function(done) {
      this.session.trigger('ember-simple-auth:session-authentication-failed');

      Ember.run.next(this, function() {
        expect(this.route.send).to.have.been.calledWith('sessionAuthenticationFailed');
        done();
      });
    });

    it('handles the "ember-simple-auth:session-invalidation-succeeded" of the session', function(done) {
      this.session.trigger('ember-simple-auth:session-invalidation-succeeded');

      Ember.run.next(this, function() {
        expect(this.route.send).to.have.been.calledWith('sessionInvalidationSucceeded');
        done();
      });
    });

    it('handles the "ember-simple-auth:session-invalidation-failed" of the session', function(done) {
      this.session.trigger('ember-simple-auth:session-invalidation-failed');

      Ember.run.next(this, function() {
        expect(this.route.send).to.have.been.calledWith('sessionInvalidationFailed');
        done();
      });
    });
  });

  describe('the "authenticateSession" action', function() {
    beforeEach(function() {
      sinon.spy(this.route, 'transitionTo');
    });

    it('transitions to "Configuration.authenticationRoute"', function() {
      this.route._actions.authenticateSession.apply(this.route);

      expect(this.route.transitionTo).to.have.been.calledWith(Configuration.authenticationRoute);
    });
  });

  describe('the "sessionAuthenticationSucceeded" action', function() {
    beforeEach(function() {
      sinon.spy(this.route, 'transitionTo');
    });

    describe('when an attempted transition is stored in the session', function() {
      beforeEach(function() {
        this.attemptedTransition = { retry: function() {} };
        this.session.set('attemptedTransition', this.attemptedTransition);
      });

      it('retries that transition', function() {
        var attemptedTransitionMock = sinon.mock(this.attemptedTransition);
        attemptedTransitionMock.expects('retry').once();

        this.route._actions.sessionAuthenticationSucceeded.apply(this.route);

        attemptedTransitionMock.verify();
      });

      it('removes it from the session', function() {
        this.route._actions.sessionAuthenticationSucceeded.apply(this.route);

        expect(this.session.get('attemptedTransition')).to.be.null;
      });
    });

    describe('when no attempted transition is stored in the session', function() {
      it('transitions to "Configuration.routeAfterAuthentication"', function() {
        this.route._actions.sessionAuthenticationSucceeded.apply(this.route);

        expect(this.route.transitionTo).to.have.been.calledWith(Configuration.routeAfterAuthentication);
      });
    });
  });

  describe('the "invalidateSession" action', function() {
    it('invalidates the session', function() {
      sinon.stub(this.session, 'invalidate').returns(Ember.RSVP.resolve());
      this.route._actions.invalidateSession.apply(this.route);

      expect(this.session.invalidate).to.have.been.calledOnce;
    });
  });

  describe('the "sessionInvalidationSucceeded" action', function() {
    it('reloads the application', function() {
      sinon.stub(this.route, 'reloadApp');
      this.route._actions.sessionInvalidationSucceeded.apply(this.route);

      expect(this.route.reloadApp).to.have.been.calledOnce;
    });
  });

  describe('the "authorizationFailed" action', function() {
    beforeEach(function() {
      sinon.stub(this.route, 'reloadApp');
    });

    it('invalidates the session', function() {
      sinon.stub(this.session, 'invalidate').returns(Ember.RSVP.resolve());
      this.route._actions.authorizationFailed.apply(this.route);

      expect(this.session.invalidate).to.have.been.calledOnce;
    });
  });

  describe('the "error" action', function() {
    beforeEach(function() {
      sinon.spy(this.route, 'send');
    });

    describe('when the error reason is status 401', function() {
      it('invokes the "authorizationFailed" action', function() {
        this.route._actions.error.apply(this.route, [{ status: 401 }]);

        expect(this.route.send).to.have.been.calledWith('authorizationFailed');
      });

      it('returns true', function() {
        var returnValue = this.route._actions.error.apply(this.route, [{ status: 401 }]);

        expect(returnValue).to.be.true;
      });
    });

    describe('when the error reason is not status 401', function() {
      it('does not invoke the "authorizationFailed" action', function() {
        this.route._actions.error.apply(this.route, [{ status: 500 }]);

        expect(this.route.send).to.not.have.been.called;
      });

      it('returns true', function() {
        var returnValue = this.route._actions.error.apply(this.route, [{ status: 500 }]);

        expect(returnValue).to.be.true;
      });
    });
  });
});
