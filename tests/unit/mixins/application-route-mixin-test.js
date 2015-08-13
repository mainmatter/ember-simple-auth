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
      sinon.spy(route, 'sessionAuthenticated');
      sinon.spy(route, 'sessionInvalidated');
    });

    it("maps the services's 'authenticationSucceeded' event into a method call", (done) => {
      session.trigger('authenticationSucceeded');

      Ember.run.next(() => {
        expect(route.sessionAuthenticated).to.have.been.calledOnce;
        done();
      });
    });

    it("maps the services's 'invalidationSucceeded' event into a method call", (done) => {
      session.trigger('invalidationSucceeded');

      Ember.run.next(() => {
        expect(route.sessionInvalidated).to.have.been.calledOnce;
        done();
      });
    });

    it('does not attach the event listeners twice', (done) => {
      route.beforeModel();
      session.trigger('authenticationSucceeded');

      Ember.run.next(() => {
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
      it('transitions to "Configuration.base.routeAfterAuthentication"', () => {
        route.sessionAuthenticated();

        expect(route.transitionTo).to.have.been.calledWith(Configuration.base.routeAfterAuthentication);
      });
    });
  });
});
