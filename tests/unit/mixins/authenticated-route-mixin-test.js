/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Session from 'ember-simple-auth/session';
import Configuration from 'ember-simple-auth/configuration';
import EphemeralStore from 'ember-simple-auth/stores/ephemeral';

let route;
let session;
let transition;
let beforeModelReturnValue;

describe('AuthenticatedRouteMixin', () => {
  describe('#beforeModel', () => {
    beforeEach(() => {
      let MixinImplementingBeforeModel = Ember.Mixin.create({
        beforeModel() {
          return Ember.RSVP.resolve(beforeModelReturnValue);
        }
      });
      let Route = Ember.Route.extend(MixinImplementingBeforeModel, AuthenticatedRouteMixin, {
        // replace actual transitionTo as the router isn't set up etc.
        transitionTo() {}
      });

      session = Session.create({ store: EphemeralStore.create() });
      transition = {
        abort() {},
        send() {}
      };

      let container = { lookup() {} };
      sinon.stub(container, 'lookup').withArgs('service:session').returns(session);

      route = Route.create({ container });
      sinon.spy(transition, 'abort');
      sinon.spy(transition, 'send');
      sinon.spy(route, 'transitionTo');
    });

    describe('if the session is authenticated', () => {
      beforeEach(() => {
        session.set('isAuthenticated', true);
      });

      it('returns the upstream promise', () => {
        beforeModelReturnValue = 'authenticated';

        return route.beforeModel(transition)
          .then((result) => {
            expect(result).to.equal('authenticated');
          });
      });

      it('does not abort the transition', () => {
        route.beforeModel(transition);

        expect(transition.abort).to.not.have.been.called;
      });

      it('does not transition to the authentication route', () => {
        route.beforeModel(transition);

        expect(route.transitionTo).to.not.have.been.calledWith(Configuration.base.authenticationRoute);
      });
    });

    describe('if the session is not authenticated', () => {
      it('returns the upstream promise', () => {
        beforeModelReturnValue = 'unauthenticated';

        return route.beforeModel(transition)
          .then((result) => {
            expect(result).to.equal('unauthenticated');
          });
      });

      it('aborts the transition', () => {
        route.beforeModel(transition);

        expect(transition.abort).to.have.been.called;
      });

      it('transitions to the authentication route', () => {
        route.beforeModel(transition);

        expect(route.transitionTo).to.have.been.calledWith(Configuration.base.authenticationRoute);
      });
    });
  });
});
