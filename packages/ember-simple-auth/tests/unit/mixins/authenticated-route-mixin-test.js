/* eslint-disable ember/no-mixins, ember/no-new-mixins */

import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Mixin from '@ember/object/mixin';
import { setOwner } from '@ember/application';
import RSVP from 'rsvp';
import Route from '@ember/routing/route';
import Service from '@ember/service';
import sinonjs from 'sinon';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

module('AuthenticatedRouteMixin', function(hooks) {
  setupTest(hooks);

  let sinon;
  let route;
  let router;
  let transition;

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

      transition = {
        intent: {
          url: '/transition/target/url'
        },
        send() {}
      };
      this.owner.register('service:router', Service.extend({
        transitionTo() {}
      }));
      router = this.owner.lookup('service:router');

      this.owner.register('service:session', Service.extend());

      route = Route.extend(MixinImplementingBeforeModel, AuthenticatedRouteMixin).create();
      setOwner(route, this.owner);

      sinon.spy(transition, 'send');
      sinon.spy(router, 'transitionTo');
    });

    module('if the session is authenticated', function(hooks) {
      hooks.beforeEach(function() {
        let session = this.owner.lookup('service:session');
        session.set('isAuthenticated', true);
      });

      test('returns the upstream promise', async function(assert) {
        let result = await route.beforeModel(transition);

        assert.equal(result, 'upstreamReturnValue');
      });

      test('does not transition to the authentication route', function(assert) {
        route.beforeModel(transition);

        assert.notOk(router.transitionTo.calledWith('login'));
      });
    });

    module('if the session is not authenticated', function() {
      test('does not return the upstream promise', function(assert) {
        assert.equal(route.beforeModel(transition), undefined);
      });

      test('transitions to "login" as the default authentication route', function(assert) {
        route.beforeModel(transition);
        assert.ok(router.transitionTo.calledWith('login'));
      });

      test('transitions to the set authentication route', function(assert) {
        let authenticationRoute = 'path/to/route';
        route.set('authenticationRoute', authenticationRoute);

        route.beforeModel(transition);
        assert.ok(router.transitionTo.calledWith(authenticationRoute));
      });

      test('sets the redirectTarget cookie in fastboot', function(assert) {
        this.owner.register('service:fastboot', Service.extend({
          isFastBoot: true,
          init() {
            this._super(...arguments);
            this.request = {
              protocol: 'https'
            };
          },
        }));
        let writeCookieStub = sinon.stub();
        this.owner.register('service:cookies', Service.extend({
          write: writeCookieStub
        }));

        let cookieName = 'ember_simple_auth-redirectTarget';

        route.beforeModel(transition);
        assert.ok(writeCookieStub.calledWith(cookieName, transition.intent.url, {
          path: '/',
          secure: true
        }));
      });
    });
  });
});
