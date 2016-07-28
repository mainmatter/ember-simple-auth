/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import InternalSession from 'ember-simple-auth/internal-session';
import EphemeralStore from 'ember-simple-auth/session-stores/ephemeral';
import Configuration from 'ember-simple-auth/configuration';

const { Route, run: { next } } = Ember;

describe('ApplicationRouteMixin', () => {
  let session;
  let route;

  beforeEach(() => {
    session = InternalSession.create({ store: EphemeralStore.create() });

    route = Route.extend(ApplicationRouteMixin, {
      transitionTo() {}
    }).create({
      session
    });
  });

  describe('mapping of service events to route methods', () => {
    beforeEach(() => {
      sinon.spy(route, 'sessionAuthenticated');
      sinon.spy(route, 'sessionInvalidated');
    });

    it("maps the services's 'authenticationSucceeded' event into a method call", (done) => {
      session.trigger('authenticationSucceeded');

      next(() => {
        expect(route.sessionAuthenticated).to.have.been.calledOnce;
        done();
      });
    });

    it("maps the services's 'invalidationSucceeded' event into a method call", (done) => {
      session.trigger('invalidationSucceeded');

      next(() => {
        expect(route.sessionInvalidated).to.have.been.calledOnce;
        done();
      });
    });

    it('does not attach the event listeners twice', (done) => {
      route.beforeModel();
      session.trigger('authenticationSucceeded');

      next(() => {
        expect(route.sessionAuthenticated).to.have.been.calledOnce;
        done();
      });
    });
  });

  describe('sessionAuthenticated', () => {
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
        route.sessionAuthenticated();

        expect(attemptedTransition.retry).to.have.been.calledOnce;
      });

      it('removes it from the session', () => {
        route.sessionAuthenticated();

        expect(session.get('attemptedTransition')).to.be.null;
      });
    });

    describe('when no attempted transition is stored in the session', () => {
      it('transitions to "Configuration.routeAfterAuthentication"', () => {
        route.sessionAuthenticated();

        expect(route.transitionTo).to.have.been.calledWith(Configuration.routeAfterAuthentication);
      });
    });
  });
});
