import ApplicationRouteMixin from 'ember-simple-auth/mixins/application_route_mixin';
import Session from 'ember-simple-auth/session';
import EphemeralStore from 'ember-simple-auth/stores/ephemeral';
import Configuration from 'ember-simple-auth/configuration';

var TestRoute = Ember.Route.extend(ApplicationRouteMixin);

describe('ApplicationRouteMixin', function() {
  beforeEach(function() {
    this.session = Session.create({ store: EphemeralStore.create() });
    this.route   = Ember.Route.extend(ApplicationRouteMixin, {
      send: function() {},
      transitionTo: function() {}
    }).create({ session: this.session });
  });

  describe('intialization', function() {
    beforeEach(function() {
      sinon.spy(this.route, 'send');
    });

    it("translates the session's 'sessionAuthenticationSucceeded' event into an action invocation", function(done) {
      this.session.trigger('sessionAuthenticationSucceeded');

      Ember.run.next(this, function() {
        expect(this.route.send).to.have.been.calledWith('sessionAuthenticationSucceeded');
        done();
      });
    });

    it("translates the session's 'sessionAuthenticationFailed' event into an action invocation", function(done) {
      this.session.trigger('sessionAuthenticationFailed', 'error');

      Ember.run.next(this, function() {
        expect(this.route.send).to.have.been.calledWith('sessionAuthenticationFailed', 'error');
        done();
      });
    });

    it("translates the session's 'sessionInvalidationSucceeded' event into an action invocation", function(done) {
      this.session.trigger('sessionInvalidationSucceeded');

      Ember.run.next(this, function() {
        expect(this.route.send).to.have.been.calledWith('sessionInvalidationSucceeded');
        done();
      });
    });

    it("translates the session's 'sessionInvalidationFailed' event into an action invocation", function(done) {
      this.session.trigger('sessionInvalidationFailed', 'error');

      Ember.run.next(this, function() {
        expect(this.route.send).to.have.been.calledWith('sessionInvalidationFailed', 'error');
        done();
      });
    });

    it("translates the session's 'authorizationFailed' event into an action invocation", function(done) {
      this.session.trigger('authorizationFailed');

      Ember.run.next(this, function() {
        expect(this.route.send).to.have.been.calledWith('authorizationFailed');
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

  describe('the "authorizationFailed" action', function() {
    describe('when the session is authenticated', function() {
      beforeEach(function() {
        this.session.set('isAuthenticated', true);
      });

      it('invalidates the session', function() {
        sinon.stub(this.session, 'invalidate').returns(Ember.RSVP.resolve());
        this.route._actions.authorizationFailed.apply(this.route);

        expect(this.session.invalidate).to.have.been.calledOnce;
      });
    });

    describe('when the session is not authenticated', function() {
      it('does not try to invalidate the session', function() {
        sinon.stub(this.session, 'invalidate').returns(Ember.RSVP.resolve());
        this.route._actions.authorizationFailed.apply(this.route);

        expect(this.session.invalidate).to.not.have.been.calledOnce;
      });
    });
  });
});
