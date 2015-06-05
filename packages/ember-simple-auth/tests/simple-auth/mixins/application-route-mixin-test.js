import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';
import Session from 'simple-auth/session';
import EphemeralStore from 'simple-auth/stores/ephemeral';
import Configuration from 'simple-auth/configuration';

var TestRoute = Ember.Route.extend(ApplicationRouteMixin);

describe('ApplicationRouteMixin', function() {
  beforeEach(function() {
    this.session = Session.create();
    this.session.setProperties({ store: EphemeralStore.create() });
    this.route = Ember.Route.extend(ApplicationRouteMixin, {
      send: function() {},
      transitionTo: function() {}
    }).create({ session: this.session });
  });

  describe('#beforeModel', function() {
    beforeEach(function() {
      this.transition = { send: function() {} };
      sinon.spy(this.route, 'send');
    });

    context('when there is no active route', function() {
      beforeEach(function() {
        sinon.spy(this.transition, 'send');
        this.route.beforeModel(this.transition);
      });

      it('sends the action to the transition', function (done) {
        this.session.trigger('authorizationFailed');

        Ember.run.next(this, function () {
          expect(this.transition.send).to.have.been.calledWith('authorizationFailed');
          done();
        });
      });
    });

    context('when there is an active route', function() {
      beforeEach(function() {
        this.route.beforeModel(this.transition);
        this.route.activate();
      });

      it("translates the session's 'sessionAuthenticationSucceeded' event into an action invocation", function(done) {
        this.session.trigger('sessionAuthenticationSucceeded');

        Ember.run.next(this, function() {
          expect(this.route.send).to.have.been.calledWith('sessionAuthenticationSucceeded');
          done();
        });
      });

      it('sets _authRouteEntryComplete so we know actions can be sent to the route', function() {
        expect(this.route.get('_authRouteEntryComplete')).to.be.true;
      });

      it('sends the action to the transition on a new route instance', function(done) {
        var route2 = Ember.Route.extend(ApplicationRouteMixin, {
          transitionTo: function() {}
        }).create({ session: this.session });
        var transition = { send: function() {} };
        sinon.spy(transition, 'send');
        sinon.spy(route2, 'send');
        route2.beforeModel(transition);
        this.session.trigger('sessionAuthenticationSucceeded');

        Ember.run.next(this, function() {
          expect(transition.send).to.have.been.calledWith('sessionAuthenticationSucceeded');
          expect(route2.send).to.not.have.been.called;
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

      it('does not attach the event listeners twice', function(done) {
        this.route.beforeModel(this.transition);
        this.session.trigger('sessionAuthenticationSucceeded');

        Ember.run.next(this, function() {
          expect(this.route.send).to.have.been.calledOnce;
          done();
        });
      });
    });
  });

  describe('the "sessionRequiresAuthentication" action', function() {
    beforeEach(function() {
      sinon.spy(this.route, 'transitionTo');
    });

    it('transitions to "Configuration.authenticationRoute"', function() {
      this.route._actions.sessionRequiresAuthentication.apply(this.route);

      expect(this.route.transitionTo).to.have.been.calledWith(Configuration.authenticationRoute);
    });
  });

  describe('the "authenticateSession" action', function() {
    beforeEach(function() {
      var route = this.route;
      sinon.spy(route, 'transitionTo');
      route.send = function(name) {
        if (name === 'sessionRequiresAuthentication') {
          route._actions.sessionRequiresAuthentication.apply(route);
        }
      };
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

    context('when an attempted transition is stored in the session', function() {
      beforeEach(function() {
        this.attemptedTransition = { retry: function() {} };
        this.session.set('attemptedTransition', this.attemptedTransition);
      });

      it('retries that transition', function() {
        sinon.spy(this.attemptedTransition, 'retry');

        this.route._actions.sessionAuthenticationSucceeded.apply(this.route);

        expect(this.attemptedTransition.retry).to.have.been.calledOnce;
      });

      it('removes it from the session', function() {
        this.route._actions.sessionAuthenticationSucceeded.apply(this.route);

        expect(this.session.get('attemptedTransition')).to.be.null;
      });
    });

    context('when no attempted transition is stored in the session', function() {
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
    context('when the session is authenticated', function() {
      beforeEach(function() {
        this.session.set('isAuthenticated', true);
      });

      it('invalidates the session', function() {
        sinon.stub(this.session, 'invalidate').returns(Ember.RSVP.resolve());
        this.route._actions.authorizationFailed.apply(this.route);

        expect(this.session.invalidate).to.have.been.calledOnce;
      });
    });

    context('when the session is not authenticated', function() {
      it('does not try to invalidate the session', function() {
        sinon.stub(this.session, 'invalidate').returns(Ember.RSVP.resolve());
        this.route._actions.authorizationFailed.apply(this.route);

        expect(this.session.invalidate).to.not.have.been.calledOnce;
      });
    });
  });
});
