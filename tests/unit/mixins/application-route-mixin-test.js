/* jshint expr:true */
import Ember from 'ember';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import InternalSession from 'ember-simple-auth/internal-session';
import EphemeralStore from 'ember-simple-auth/session-stores/ephemeral';

import createWithContainer from '../../helpers/create-with-container';

const { Route, run: { next } } = Ember;

describe('ApplicationRouteMixin', () => {
  let session;
  let route;
  let cookiesMock;
  let containerMock;

  beforeEach(() => {
    session = InternalSession.create({ store: EphemeralStore.create() });
    cookiesMock = {
      read: sinon.stub(),
      clear: sinon.stub()
    };
    containerMock = {
      lookup: sinon.stub()
    };

    containerMock.lookup.withArgs('service:cookies').returns(cookiesMock);

    route = createWithContainer(Route.extend(ApplicationRouteMixin, {
      transitionTo() {}
    }), { session }, containerMock);
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

    describe('when a redirect target is stored in a cookie', () => {
      let cookieName = 'ember_simple_auth-redirectTarget';
      let targetUrl = 'transition/target/url';

      beforeEach(() => {
        cookiesMock.read.withArgs(cookieName).returns(targetUrl);
      });

      it('transitions to the url', () => {
        route.sessionAuthenticated();

        expect(route.transitionTo).to.have.been.calledWith(targetUrl);
      });

      it('clears the cookie', () => {
        route.sessionAuthenticated();

        expect(cookiesMock.clear).to.have.been.calledWith(cookieName);
      });
    });

    describe('when no attempted transition is stored in the session', () => {
      it('transitions to "routeAfterAuthentication"', () => {
        let routeAfterAuthentication = 'path/to/route';
        route.set('routeAfterAuthentication', routeAfterAuthentication);
        route.sessionAuthenticated();

        expect(route.transitionTo).to.have.been.calledWith(routeAfterAuthentication);
      });
    });
  });
});
