import Mixin from '@ember/object/mixin';
import RSVP from 'rsvp';
import Route from '@ember/routing/route';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import InternalSession from 'ember-simple-auth/internal-session';
import Configuration from 'ember-simple-auth/configuration';
import EphemeralStore from 'ember-simple-auth/session-stores/ephemeral';

import createWithContainer from '../../helpers/create-with-container';

describe('AuthenticatedRouteMixin', () => {
  let route;
  let session;
  let transition;
  let cookiesMock;
  let fastbootMock;
  let containerMock;

  describe('#beforeModel', function() {
    beforeEach(function() {
      const MixinImplementingBeforeModel = Mixin.create({
        beforeModel() {
          return RSVP.resolve('upstreamReturnValue');
        }
      });

      session = InternalSession.create({ store: EphemeralStore.create() });
      transition = {
        intent: {
          url: '/transition/target/url'
        },
        send() {}
      };
      cookiesMock = {
        write: sinon.stub()
      };
      fastbootMock = {
        get: sinon.stub()
      };
      containerMock = {
        lookup: sinon.stub()
      };

      containerMock.lookup.withArgs('service:cookies').returns(cookiesMock);
      containerMock.lookup.withArgs('service:fastboot').returns(fastbootMock);

      route = createWithContainer(Route.extend(MixinImplementingBeforeModel, AuthenticatedRouteMixin, {
        // pretend this is never FastBoot
        _isFastBoot: false,
        // replace actual transitionTo as the router isn't set up etc.
        transitionTo() {}
      }), { session }, containerMock);

      sinon.spy(transition, 'send');
      sinon.spy(route, 'transitionTo');
    });

    describe('if the session is authenticated', function() {
      beforeEach(function() {
        session.set('isAuthenticated', true);
      });

      it('returns the upstream promise', function() {
        return route.beforeModel(transition).then((result) => {
          expect(result).to.equal('upstreamReturnValue');
        });
      });

      it('does not transition to the authentication route', function() {
        route.beforeModel(transition);

        expect(route.transitionTo).to.not.have.been.calledWith(Configuration.authenticationRoute);
      });
    });

    describe('if the session is not authenticated', function() {
      it('does not return the upstream promise', function() {
        expect(route.beforeModel(transition)).to.be.undefined;
      });

      it('transitions to the authentication route', function() {
        let authenticationRoute = 'path/to/route';
        route.set('authenticationRoute', authenticationRoute);

        route.beforeModel(transition);
        expect(route.transitionTo).to.have.been.calledWith(authenticationRoute);
      });

      it('sets the redirectTarget cookie in fastboot', function() {
        fastbootMock.get.withArgs('request.protocol').returns('https');

        let cookieName = 'ember_simple_auth-redirectTarget';

        route.reopen({
          _isFastBoot: true
        });

        route.beforeModel(transition);
        expect(cookiesMock.write).to.have.been.calledWith(cookieName, transition.intent.url, {
          path: '/',
          secure: true
        });
      });
    });
  });
});
