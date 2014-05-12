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

  describe('the "authorizationFailed" action', function() {
    it('invalidates the session', function() {
      sinon.stub(this.session, 'invalidate').returns(Ember.RSVP.resolve());
      this.route._actions.authorizationFailed.apply(this.route);

      expect(this.session.invalidate).to.have.been.calledOnce;
    });
  });
});
