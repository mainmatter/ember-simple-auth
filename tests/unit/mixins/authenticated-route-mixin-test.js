/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import InternalSession from 'ember-simple-auth/internal-session';
import Configuration from 'ember-simple-auth/configuration';
import EphemeralStore from 'ember-simple-auth/session-stores/ephemeral';

const { Mixin, RSVP, Route } = Ember;

describe('AuthenticatedRouteMixin', () => {
  let route;
  let session;
  let transition;

  describe('#beforeModel', () => {
    beforeEach(() => {
      const MixinImplementingBeforeModel = Mixin.create({
        beforeModel() {
          return RSVP.resolve('upstreamReturnValue');
        }
      });

      session = InternalSession.create({ store: EphemeralStore.create() });
      transition = {
        send() {}
      };

      route = Route.extend(MixinImplementingBeforeModel, AuthenticatedRouteMixin, {
        // pretend this is never FastBoot
        _isFastBoot: false,
        // replace actual transitionTo as the router isn't set up etc.
        transitionTo() {}
      }).create({ session });
      sinon.spy(transition, 'send');
      sinon.spy(route, 'transitionTo');
    });

    describe('if the session is authenticated', () => {
      beforeEach(() => {
        session.set('isAuthenticated', true);
      });

      it('returns the upstream promise', () => {
        return route.beforeModel(transition).then((result) => {
          expect(result).to.equal('upstreamReturnValue');
        });
      });

      it('does not transition to the authentication route', () => {
        route.beforeModel(transition);

        expect(route.transitionTo).to.not.have.been.calledWith(Configuration.authenticationRoute);
      });
    });

    describe('if the session is not authenticated', () => {
      it('does not return the upstream promise', () => {
        expect(route.beforeModel(transition)).to.be.undefined;
      });

      it('transitions to the authentication route', () => {
        route.beforeModel(transition);

        expect(route.transitionTo).to.have.been.calledWith(Configuration.authenticationRoute);
      });
    });
  });
});
