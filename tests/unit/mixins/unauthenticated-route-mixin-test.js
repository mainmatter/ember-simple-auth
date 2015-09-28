/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import Session from 'ember-simple-auth/session';
import Configuration from 'ember-simple-auth/configuration';
import EphemeralStore from 'ember-simple-auth/stores/ephemeral';

describe('UnauthenticatedRouteMixin', () => {
  let route;
  let session;
  let transition;

  describe('#beforeModel', () => {
    beforeEach(() => {
      session    = Session.create({ store: EphemeralStore.create() });
      transition = {
        abort() {},
        send() {}
      };

      route = Ember.Route.extend(UnauthenticatedRouteMixin, {
        transitionTo() {}
      }).create({
        session
      });
      sinon.spy(transition, 'abort');
      sinon.spy(route, 'transitionTo');
    });

    describe('if the session is authenticated', () => {
      beforeEach(() => {
        session.set('isAuthenticated', true);
      });

      it('aborts the transition', () => {
        route.beforeModel(transition);

        expect(transition.abort).to.have.been.called;
      });

      it('transitions to routeIfAlreadyAuthenticated', () => {
        route.beforeModel(transition);

        expect(route.transitionTo).to.have.been.calledWith(Configuration.routeIfAlreadyAuthenticated);
      });
    });

    describe('if the session is not authenticated', () => {
      it('does not abort the transition', () => {
        route.beforeModel(transition);

        expect(transition.abort).to.not.have.been.called;
      });

      it('does not call route transitionTo', () => {
        route.beforeModel(transition);

        expect(route.transitionTo).to.not.have.been.called;
      });
    });
  });
});
