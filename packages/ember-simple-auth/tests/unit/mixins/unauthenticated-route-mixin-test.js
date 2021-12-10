/* eslint-disable ember/no-mixins, ember/no-new-mixins */

import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Mixin from '@ember/object/mixin';
import { setOwner } from '@ember/application';
import RSVP from 'rsvp';
import Route from '@ember/routing/route';
import Service from '@ember/service';
import sinonjs from 'sinon';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

module('UnauthenticatedRouteMixin', function(hooks) {
  setupTest(hooks);

  let sinon;
  let route;
  let router;

  hooks.beforeEach(function() {
    sinon = sinonjs.createSandbox();
  });

  hooks.afterEach(function() {
    sinon.restore();
  });

  module('#beforeModel', function(hooks) {
    hooks.beforeEach(function() {
      const MixinImplementingBeforeModel = Mixin.create({
        beforeModel() {
          return RSVP.resolve('upstreamReturnValue');
        }
      });

      this.owner.register('service:session', Service.extend());

      route = Route.extend(MixinImplementingBeforeModel, UnauthenticatedRouteMixin).create();
      setOwner(route, this.owner);

      this.owner.register('service:router', Service.extend({
        transitionTo() {}
      }));
      router = this.owner.lookup('service:router');

      sinon.spy(router, 'transitionTo');
    });

    module('if the session is authenticated', function(hooks) {
      hooks.beforeEach(function() {
        let session = this.owner.lookup('service:session');
        session.set('isAuthenticated', true);
      });

      test('transitions to "index" by default', function(assert) {
        route.beforeModel();

        assert.ok(router.transitionTo.calledWith('index'));
      });

      test('transitions to set routeIfAlreadyAuthenticated', function(assert) {
        let routeIfAlreadyAuthenticated = 'path/to/route';
        route.set('routeIfAlreadyAuthenticated', routeIfAlreadyAuthenticated);

        route.beforeModel();
        assert.ok(router.transitionTo.calledWith(routeIfAlreadyAuthenticated));
      });

      test('does not return the upstream promise', function(assert) {
        assert.equal(route.beforeModel(), undefined);
      });
    });

    module('if the session is not authenticated', function() {
      test('does not transition', function(assert) {
        route.beforeModel();

        assert.notOk(router.transitionTo.called);
      });

      test('returns the upstream promise', async function(assert) {
        let result = await route.beforeModel();

        assert.equal(result, 'upstreamReturnValue');
      });
    });
  });
});
