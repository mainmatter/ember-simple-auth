/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import Session from 'ember-simple-auth/session';
import EphemeralStore from 'ember-simple-auth/stores/ephemeral';
import Configuration from 'ember-simple-auth/configuration';

let session;
let route;

describe('ApplicationRouteMixin', () => {
  beforeEach(() => {
    session = Session.create({ store: EphemeralStore.create() });

    let container = { lookup() {} };
    sinon.stub(container, 'lookup').withArgs('service:session').returns(session);

    route = Ember.Route.extend(ApplicationRouteMixin, {
      transitionTo() {}
    }).create({ container });
  });

  describe('mapping of service events to route methods', () => {
    beforeEach(() => {
      sinon.spy(route, 'sessionAuthenticationSucceeded');
      sinon.spy(route, 'sessionAuthenticationFailed');
      sinon.spy(route, 'sessionInvalidationSucceeded');
      sinon.spy(route, 'sessionInvalidationFailed');
      sinon.spy(route, 'authorizationFailed');
    });

    it("maps the services's 'sessionAuthenticationSucceeded' event into a method call", (done) => {
      session.trigger('sessionAuthenticationSucceeded');

      Ember.run.next(() => {
        expect(route.sessionAuthenticationSucceeded).to.have.been.calledOnce;
        done();
      });
    });

    it("maps the services's 'sessionAuthenticationFailed' event into a method call", (done) => {
      session.trigger('sessionAuthenticationFailed', 'error');

      Ember.run.next(() => {
        expect(route.sessionAuthenticationFailed).to.have.been.calledWith('error');
        done();
      });
    });

    it("maps the services's 'sessionInvalidationSucceeded' event into a method call", (done) => {
      session.trigger('sessionInvalidationSucceeded');

      Ember.run.next(() => {
        expect(route.sessionInvalidationSucceeded).to.have.been.calledOnce;
        done();
      });
    });

    it("maps the services's 'sessionInvalidationFailed' event into a method call", (done) => {
      session.trigger('sessionInvalidationFailed', 'error');

      Ember.run.next(() => {
        expect(route.sessionInvalidationFailed).to.have.been.calledOnce;
        done();
      });
    });

    it("maps the services's 'authorizationFailed' event into a method call", (done) => {
      session.trigger('authorizationFailed');

      Ember.run.next(() => {
        expect(route.authorizationFailed).to.have.been.calledOnce;
        done();
      });
    });

    it('does not attach the event listeners twice', (done) => {
      route.beforeModel();
      session.trigger('sessionAuthenticationSucceeded');

      Ember.run.next(() => {
        expect(route.sessionAuthenticationSucceeded).to.have.been.calledOnce;
        done();
      });
    });
  });

  describe('sessionAuthenticationSucceeded', () => {
    beforeEach(() => {
      sinon.spy(route, 'transitionTo');
    });

    describe('when an attempted transition is stored in the session', () => {
      let attemptedTransition;

      beforeEach(() => {
        attemptedTransition = {
          retry() {}
        };
        session.set('attemptedTransition', attemptedTransition);
      });

      it('retries that transition', () => {
        sinon.spy(attemptedTransition, 'retry');
        route.sessionAuthenticationSucceeded();

        expect(attemptedTransition.retry).to.have.been.calledOnce;
      });

      it('removes it from the session', () => {
        route.sessionAuthenticationSucceeded();

        expect(session.get('attemptedTransition')).to.be.null;
      });
    });

    describe('when no attempted transition is stored in the session', () => {
      it('transitions to "Configuration.base.routeAfterAuthentication"', () => {
        route.sessionAuthenticationSucceeded();

        expect(route.transitionTo).to.have.been.calledWith(Configuration.base.routeAfterAuthentication);
      });
    });
  });

  describe('authorizationFailed', () => {
    describe('when the session is authenticated', () => {
      beforeEach(() => {
        session.set('isAuthenticated', true);
      });

      it('invalidates the session', () => {
        sinon.stub(session, 'invalidate').returns(Ember.RSVP.resolve());
        route.authorizationFailed();

        expect(session.invalidate).to.have.been.calledOnce;
      });
    });

    describe('when the session is not authenticated', () => {
      it('does not try to invalidate the session', () => {
        sinon.stub(session, 'invalidate').returns(Ember.RSVP.resolve());
        route.authorizationFailed();

        expect(session.invalidate).to.not.have.been.calledOnce;
      });
    });
  });
});
