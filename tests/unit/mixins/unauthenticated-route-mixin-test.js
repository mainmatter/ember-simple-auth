import Mixin from '@ember/object/mixin';
import RSVP from 'rsvp';
import Route from '@ember/routing/route';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import InternalSession from 'ember-simple-auth/internal-session';
import EphemeralStore from 'ember-simple-auth/session-stores/ephemeral';

describe('UnauthenticatedRouteMixin', () => {
  let route;
  let session;
  let transition;

  describe('#beforeModel', function() {
    beforeEach(function() {
      const MixinImplementingBeforeModel = Mixin.create({
        beforeModel() {
          return RSVP.resolve('upstreamReturnValue');
        }
      });

      session = InternalSession.create({ store: EphemeralStore.create() });
      transition = {
        send() {}
      };

      route = Route.extend(MixinImplementingBeforeModel, UnauthenticatedRouteMixin, {
        // pretend this is never FastBoot
        _isFastBoot: false,
        // replace actual transitionTo as the router isn't set up etc.
        transitionTo() {}
      }).create({ session });
      sinon.spy(route, 'transitionTo');
    });

    describe('if the session is authenticated', function() {
      beforeEach(function() {
        session.set('isAuthenticated', true);
      });

      it('transitions to routeIfAlreadyAuthenticated', function() {
        let routeIfAlreadyAuthenticated = 'path/to/route';
        route.set('routeIfAlreadyAuthenticated', routeIfAlreadyAuthenticated);

        route.beforeModel(transition);
        expect(route.transitionTo).to.have.been.calledWith(routeIfAlreadyAuthenticated);
      });

      it('does not return the upstream promise', function() {
        expect(route.beforeModel(transition)).to.be.undefined;
      });
    });

    describe('if the session is not authenticated', function() {
      it('does not call route transitionTo', function() {
        route.beforeModel(transition);

        expect(route.transitionTo).to.not.have.been.called;
      });

      it('returns the upstream promise', function() {
        return route.beforeModel(transition).then((result) => {
          expect(result).to.equal('upstreamReturnValue');
        });
      });
    });
  });
});
