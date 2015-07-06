/* jshint expr:true */
import { it } from 'ember-mocha';
import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import Session from 'ember-simple-auth/session';
import LocalStorageStore from 'ember-simple-auth/stores/local-storage';
import EphemeralStore from 'ember-simple-auth/stores/ephemeral';
import Configuration from 'ember-simple-auth/configuration';

let TestRoute = Ember.Route.extend(ApplicationRouteMixin);
let session;
let route;
let container;
let router;
let store;
let lookupStub;

describe('ApplicationRouteMixin', () => {
  beforeEach(() => {
    container = {
      lookup() {}
    };
    router = {
      get() {
        return 'rootURL';
      }
    };
    store = LocalStorageStore.create();

    session = Session.create();
    session.setProperties({ store: EphemeralStore.create() });

    route = Ember.Route.extend(ApplicationRouteMixin, {
      send() {},
      transitionTo() {},
      container
    }).create({ session });

    lookupStub = sinon.stub(container, 'lookup');
    lookupStub.withArgs('router:main').returns(router);
    lookupStub.withArgs('simple-auth-session:main').returns(session);
    lookupStub.withArgs('session-store:local-storage').returns(store);
  });

  describe('#beforeModel', () => {
    let transition;

    beforeEach(() => {
      transition = {
        send() {}
      };
      sinon.spy(route, 'send');
    });

    context('when there is no active route', () => {
      beforeEach(() => {
        sinon.spy(transition, 'send');
        route.beforeModel(transition);
      });

      it('sends the action to the transition', (done) => {
        session.trigger('authorizationFailed');

        Ember.run.next(() => {
          expect(transition.send).to.have.been.calledWith('authorizationFailed');
          done();
        });
      });
    });

    context('when there is an active route', () => {
      beforeEach(() => {
        Configuration.base.store = 'session-store:local-storage';
      });

      beforeEach(() => {
        route.beforeModel(transition);
        route.activate();
      });

      it("translates the session's 'sessionAuthenticationSucceeded' event into an action invocation", (done) => {
        session.trigger('sessionAuthenticationSucceeded');

        Ember.run.next(() => {
          expect(route.send).to.have.been.calledWith('sessionAuthenticationSucceeded');
          done();
        });
      });

      it("translates the session's 'sessionAuthenticationFailed' event into an action invocation", (done) => {
        session.trigger('sessionAuthenticationFailed', 'error');

        Ember.run.next(() => {
          expect(route.send).to.have.been.calledWith('sessionAuthenticationFailed', 'error');
          done();
        });
      });

      it("translates the session's 'sessionInvalidationSucceeded' event into an action invocation", (done) => {
        session.trigger('sessionInvalidationSucceeded');

        Ember.run.next(() => {
          expect(route.send).to.have.been.calledWith('sessionInvalidationSucceeded');
          done();
        });
      });

      it("translates the session's 'sessionInvalidationFailed' event into an action invocation", (done) => {
        session.trigger('sessionInvalidationFailed', 'error');

        Ember.run.next(() => {
          expect(route.send).to.have.been.calledWith('sessionInvalidationFailed', 'error');
          done();
        });
      });

      it("translates the session's 'authorizationFailed' event into an action invocation", (done) => {
        session.trigger('authorizationFailed');

        Ember.run.next(() => {
          expect(route.send).to.have.been.calledWith('authorizationFailed');
          done();
        });
      });

      it('does not attach the event listeners twice', (done) => {
        route.beforeModel(transition);
        session.trigger('sessionAuthenticationSucceeded');

        Ember.run.next(function() {
          expect(route.send).to.have.been.calledOnce;
          done();
        });
      });
    });
  });

  describe('the "sessionRequiresAuthentication" action', () => {
    beforeEach(() => {
      sinon.spy(route, 'transitionTo');
    });

    it('transitions to "Configuration.base.authenticationRoute"', () => {
      route._actions.sessionRequiresAuthentication.apply(route);

      expect(route.transitionTo).to.have.been.calledWith(Configuration.base.authenticationRoute);
    });
  });

  describe('the "sessionAuthenticationSucceeded" action', () => {
    beforeEach(() => {
      sinon.spy(route, 'transitionTo');
    });

    context('when an attempted transition is stored in the session', () => {
      let attemptedTransition;

      beforeEach(() => {
        attemptedTransition = {
          retry() {}
        };
        session.set('attemptedTransition', attemptedTransition);
      });

      it('retries that transition', () => {
        sinon.spy(attemptedTransition, 'retry');

        route._actions.sessionAuthenticationSucceeded.apply(route);

        expect(attemptedTransition.retry).to.have.been.calledOnce;
      });

      it('removes it from the session', () => {
        route._actions.sessionAuthenticationSucceeded.apply(route);

        expect(session.get('attemptedTransition')).to.be.null;
      });
    });

    context('when no attempted transition is stored in the session', () => {
      it('transitions to "Configuration.base.routeAfterAuthentication"', () => {
        route._actions.sessionAuthenticationSucceeded.apply(route);

        expect(route.transitionTo).to.have.been.calledWith(Configuration.base.routeAfterAuthentication);
      });
    });
  });

  describe('the "authorizationFailed" action', () => {
    context('when the session is authenticated', () => {
      beforeEach(() => {
        session.set('isAuthenticated', true);
      });

      it('invalidates the session', () => {
        sinon.stub(session, 'invalidate').returns(Ember.RSVP.resolve());
        route._actions.authorizationFailed.apply(route);

        expect(session.invalidate).to.have.been.calledOnce;
      });
    });

    context('when the session is not authenticated', () => {
      it('does not try to invalidate the session', () => {
        sinon.stub(session, 'invalidate').returns(Ember.RSVP.resolve());
        route._actions.authorizationFailed.apply(route);

        expect(session.invalidate).to.not.have.been.calledOnce;
      });
    });
  });
});
