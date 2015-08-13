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
});
