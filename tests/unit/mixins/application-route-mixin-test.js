import Route from '@ember/routing/route';
import { next } from '@ember/runloop';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinonjs from 'sinon';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import InternalSession from 'ember-simple-auth/internal-session';
import EphemeralStore from 'ember-simple-auth/session-stores/ephemeral';

import createWithContainer from '../../helpers/create-with-container';

describe('ApplicationRouteMixin', () => {
  let sinon;
  let session;
  let route;
  let cookiesMock;
  let containerMock;

  beforeEach(function() {
    sinon = sinonjs.sandbox.create();
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

  afterEach(function() {
    sinon.restore();
  });

  describe('mapping of service events to route methods', function() {
    beforeEach(function() {
      sinon.spy(route, 'sessionAuthenticated');
      sinon.spy(route, 'sessionInvalidated');
    });

    it("maps the services's 'authenticationSucceeded' event into a method call", function(done) {
      session.trigger('authenticationSucceeded');

      next(() => {
        expect(route.sessionAuthenticated).to.have.been.calledOnce;
        done();
      });
    });

    it("maps the services's 'invalidationSucceeded' event into a method call", function(done) {
      session.trigger('invalidationSucceeded');

      next(() => {
        expect(route.sessionInvalidated).to.have.been.calledOnce;
        done();
      });
    });

    it('does not attach the event listeners twice', function(done) {
      route.beforeModel();
      session.trigger('authenticationSucceeded');

      next(() => {
        expect(route.sessionAuthenticated).to.have.been.calledOnce;
        done();
      });
    });
  });

  describe('sessionAuthenticated', function() {
    beforeEach(function() {
      sinon.spy(route, 'transitionTo');
    });

    describe('when an attempted transition is stored in the session', function() {
      let attemptedTransition;

      beforeEach(function() {
        attemptedTransition = {
          retry() {}
        };
        session.set('attemptedTransition', attemptedTransition);
      });

      it('retries that transition', function() {
        sinon.spy(attemptedTransition, 'retry');
        route.sessionAuthenticated();

        expect(attemptedTransition.retry).to.have.been.calledOnce;
      });

      it('removes it from the session', function() {
        route.sessionAuthenticated();

        expect(session.get('attemptedTransition')).to.be.null;
      });
    });

    describe('when a redirect target is stored in a cookie', function() {
      let cookieName = 'ember_simple_auth-redirectTarget';
      let targetUrl = 'transition/target/url';

      beforeEach(function() {
        cookiesMock.read.withArgs(cookieName).returns(targetUrl);
      });

      it('transitions to the url', function() {
        route.sessionAuthenticated();

        expect(route.transitionTo).to.have.been.calledWith(targetUrl);
      });

      it('clears the cookie', function() {
        route.sessionAuthenticated();

        expect(cookiesMock.clear).to.have.been.calledWith(cookieName);
      });
    });

    describe('when no attempted transition is stored in the session', function() {
      it('transitions to "routeAfterAuthentication"', function() {
        let routeAfterAuthentication = 'path/to/route';
        route.set('routeAfterAuthentication', routeAfterAuthentication);
        route.sessionAuthenticated();

        expect(route.transitionTo).to.have.been.calledWith(routeAfterAuthentication);
      });
    });
  });
});
