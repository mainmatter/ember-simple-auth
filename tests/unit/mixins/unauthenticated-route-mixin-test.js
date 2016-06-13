/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import InternalSession from 'ember-simple-auth/internal-session';
import Configuration from 'ember-simple-auth/configuration';
import EphemeralStore from 'ember-simple-auth/session-stores/ephemeral';

describe('UnauthenticatedRouteMixin', () => {
  let route;
  let session;
  let transition;

  describe('#beforeModel', () => {
    beforeEach(() => {
      const MixinImplementingBeforeModel = Ember.Mixin.create({
        beforeModel() {
          return Ember.RSVP.resolve('upstreamReturnValue');
        }
      });
      const Route = Ember.Route.extend(MixinImplementingBeforeModel, UnauthenticatedRouteMixin, {
        // pretend this is never FastBoot
        _isFastBoot: false,
        // replace actual transitionTo as the router isn't set up etc.
        transitionTo() {}
      });

      session    = InternalSession.create({ store: EphemeralStore.create() });
      transition = {
        send() {}
      };

      route = Route.create({ session });
      sinon.spy(route, 'transitionTo');
    });

    describe('if the session is authenticated', () => {
      beforeEach(() => {
        session.set('isAuthenticated', true);
      });

      it('transitions to routeIfAlreadyAuthenticated', () => {
        route.beforeModel(transition);

        expect(route.transitionTo).to.have.been.calledWith(Configuration.routeIfAlreadyAuthenticated);
      });

      it('does not return the upstream promise', () => {
        expect(route.beforeModel(transition)).to.be.undefined;
      });
    });

    describe('if the session is not authenticated', () => {
      it('does not call route transitionTo', () => {
        route.beforeModel(transition);

        expect(route.transitionTo).to.not.have.been.called;
      });

      it('returns the upstream promise', () => {
        return route.beforeModel(transition).then((result) => {
          expect(result).to.equal('upstreamReturnValue');
        });
      });
    });
  });
});
