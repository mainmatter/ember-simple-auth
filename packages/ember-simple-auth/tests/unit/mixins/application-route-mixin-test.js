/* eslint-disable ember/no-mixins, ember/no-new-mixins */
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { next } from '@ember/runloop';
import Service from '@ember/service';
import Route from '@ember/routing/route';
import sinonjs from 'sinon';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import * as LocationUtil from 'ember-simple-auth/utils/location';

module('ApplicationRouteMixin', function(hooks) {
  setupTest(hooks);

  let sinon;
  let session;
  let sessionService;
  let route;
  let router;

  hooks.beforeEach(function() {
    sinon = sinonjs.createSandbox();

    session = this.owner.lookup('session:main');
    sessionService = this.owner.lookup('service:session');

    this.owner.register('service:cookies', Service.extend({
      read: sinon.stub(),
      clear: sinon.stub()
    }));

    this.owner.register('service:router', Service.extend({
      transitionTo() {}
    }));
    router = this.owner.lookup('service:router');

    this.owner.register('route:application', Route.extend(ApplicationRouteMixin));
    route = this.owner.lookup('route:application');
    sinon.stub(router, 'transitionTo');
  });

  hooks.afterEach(function() {
    sinon.restore();
  });

  module('mapping of service events to route methods', function(hooks) {
    hooks.beforeEach(function() {
      sinon.spy(route, 'sessionAuthenticated');
      sinon.spy(route, 'sessionInvalidated');
      sinon.stub(LocationUtil, 'default').returns({ replace() {} });
    });

    hooks.afterEach(function() {
      sinon.restore();
    });

    test("maps the services's 'authenticationSucceeded' event into a method call", async function(assert) {
      assert.expect(1);
      sessionService.trigger('authenticationSucceeded');

      await new Promise(resolve => {
        next(() => {
          assert.ok(route.sessionAuthenticated.calledOnce);
          resolve();
        });
      });
    });

    test("maps the services's 'invalidationSucceeded' event into a method call", async function(assert) {
      assert.expect(1);
      sessionService.trigger('invalidationSucceeded');

      await new Promise(resolve => {
        next(() => {
          assert.ok(route.sessionInvalidated.calledOnce);
          resolve();
        });
      });
    });

    test('does not attach the event listeners twice', async function(assert) {
      assert.expect(1);
      route.beforeModel();
      sessionService.trigger('authenticationSucceeded');

      await new Promise(resolve => {
        next(() => {
          assert.ok(route.sessionAuthenticated.calledOnce);
          resolve();
        });
      });
    });
  });

  module('sessionAuthenticated', function() {
    module('when an attempted transition is stored in the session', function(hooks) {
      let attemptedTransition;

      hooks.beforeEach(function() {
        attemptedTransition = {
          retry: sinon.stub()
        };
        session.set('attemptedTransition', attemptedTransition);
      });

      test('retries that transition', function(assert) {
        route.sessionAuthenticated();

        assert.ok(attemptedTransition.retry.calledOnce);
      });

      test('removes it from the session', function(assert) {
        route.sessionAuthenticated();

        assert.equal(session.get('attemptedTransition'), null);
      });
    });

    module('when a redirect target is stored in a cookie', function(hooks) {
      let cookieName = 'ember_simple_auth-redirectTarget';
      let targetUrl = 'transition/target/url';
      let clearStub;

      hooks.beforeEach(function() {
        clearStub = sinon.stub();
        this.owner.register('service:cookies', Service.extend({
          read() {
            return targetUrl;
          },
          clear: clearStub
        }));
      });

      test('transitions to the url', function(assert) {
        route.sessionAuthenticated();

        assert.ok(router.transitionTo.calledWith(targetUrl));
      });

      test('clears the cookie', function(assert) {
        route.sessionAuthenticated();

        assert.ok(clearStub.calledWith(cookieName));
      });
    });

    module('when no attempted transition is stored in the session', function() {
      test('transitions to "index" by default', function(assert) {
        route.sessionAuthenticated();

        assert.ok(router.transitionTo.calledWith('index'));
      });

      test('transitions to "routeAfterAuthentication"', function(assert) {
        let routeAfterAuthentication = 'path/to/route';
        route.set('routeAfterAuthentication', routeAfterAuthentication);
        route.sessionAuthenticated();

        assert.ok(router.transitionTo.calledWith(routeAfterAuthentication));
      });
    });
  });
});
