/* eslint-disable ember/no-mixins, ember/no-new-mixins */

import Mixin from '@ember/object/mixin';
import { setOwner } from '@ember/application';
import RSVP from 'rsvp';
import Route from '@ember/routing/route';
import Service from '@ember/service';
import { describe, beforeEach, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import { expect } from 'chai';
import sinonjs from 'sinon';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

describe('UnauthenticatedRouteMixin', () => {
  setupTest();

  let sinon;
  let route;

  beforeEach(function() {
    sinon = sinonjs.createSandbox();
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('#beforeModel', function() {
    beforeEach(function() {
      const MixinImplementingBeforeModel = Mixin.create({
        beforeModel() {
          return RSVP.resolve('upstreamReturnValue');
        }
      });

      this.owner.register('service:session', Service.extend());

      route = Route.extend(MixinImplementingBeforeModel, UnauthenticatedRouteMixin, {
        // pretend this is never FastBoot
        // replace actual transitionTo as the router isn't set up etc.
        transitionTo() {}
      }).create();
      setOwner(route, this.owner);

      sinon.spy(route, 'transitionTo');
    });

    describe('if the session is authenticated', function() {
      beforeEach(function() {
        let session = this.owner.lookup('service:session');
        session.set('isAuthenticated', true);
      });

      it('transitions to "index" by default', function() {
        route.beforeModel();
        expect(route.transitionTo).to.have.been.calledWith('index');
      });

      it('transitions to set routeIfAlreadyAuthenticated', function() {
        let routeIfAlreadyAuthenticated = 'path/to/route';
        route.set('routeIfAlreadyAuthenticated', routeIfAlreadyAuthenticated);

        route.beforeModel();
        expect(route.transitionTo).to.have.been.calledWith(routeIfAlreadyAuthenticated);
      });

      it('does not return the upstream promise', function() {
        expect(route.beforeModel()).to.be.undefined;
      });
    });

    describe('if the session is not authenticated', function() {
      it('does not call route transitionTo', function() {
        route.beforeModel();

        expect(route.transitionTo).to.not.have.been.called;
      });

      it('returns the upstream promise', async function() {
        let result = await route.beforeModel();

        expect(result).to.equal('upstreamReturnValue');
      });
    });
  });
});
