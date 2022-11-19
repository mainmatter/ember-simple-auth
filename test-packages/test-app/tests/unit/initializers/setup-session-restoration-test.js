import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import sinonjs from 'sinon';
import setupSessionRestoration from 'ember-simple-auth/initializers/setup-session-restoration';
import Configuration from 'ember-simple-auth/configuration';
import { registerDeprecationHandler } from '@ember/debug';

module('setupSessionRestoration', function(hooks) {
  setupTest(hooks);

  let sinon;

  hooks.beforeEach(function() {
    sinon = sinonjs.createSandbox();

    this.owner.register('route:application', Route.extend());
  });

  hooks.afterEach(function() {
    sinon.restore();
  });

  test('adds a beforeModel method', function(assert) {
    setupSessionRestoration(this.owner);

    const route = this.owner.lookup('route:application');
    assert.equal(typeof route.beforeModel, 'function');
  });

  module('useSessionSetupMethod', function(hooks) {
    let useSessionSetupMethodDefault;

    hooks.beforeEach(function() {
      useSessionSetupMethodDefault = Configuration.useSessionSetupMethod;
      Configuration.useSessionSetupMethod = false;
    });

    hooks.afterEach(function() {
      Configuration.useSessionSetupMethod = useSessionSetupMethodDefault;
    });

    test("doesn't extend application route when is true", function(assert) {
      Configuration.useSessionSetupMethod = true;
      const route = this.owner.resolveRegistration('route:application');
      const reopenStub = sinon.stub(route, 'reopen');

      setupSessionRestoration(this.owner);
      assert.notOk(reopenStub.called);
    });

    test('extends application route when is false', function(assert) {
      const route = this.owner.resolveRegistration('route:application');
      const reopenStub = sinon.stub(route, 'reopen');

      setupSessionRestoration(this.owner);
      assert.ok(reopenStub.called);
    });

    test("doesn't show deprecation when is true", function(assert) {
      Configuration.useSessionSetupMethod = true;

      let deprecations = [];
      registerDeprecationHandler((message, options, next) => {
        deprecations.push(message);

        next(message, options);
      });

      setupSessionRestoration(this.owner);

      assert.equal(deprecations.filter(deprecation => deprecation.includes('Ember Simple Auth:')), 0);
    });

    test('shows deprecation when is false', function(assert) {
      let deprecations = [];
      registerDeprecationHandler((message, options, next) => {
        deprecations.push(message);

        next(message, options);
      });

      setupSessionRestoration(this.owner);

      assert.equal(deprecations.filter(deprecation => deprecation.includes('Ember Simple Auth:')).length, 1);
    });
  });

  module('the beforeModel method', function(hooks) {
    let session;
    let route;

    hooks.beforeEach(function() {
      this.owner.register('session:main', EmberObject.extend({
        restore() {}
      }));
      session = this.owner.lookup('session:main');

      this.owner.register('route:application', Route.extend({
        beforeModel() {
          return RSVP.resolve('test');
        }
      }));
      route = this.owner.lookup('route:application');

      setupSessionRestoration(this.owner);
    });

    module('when session restoration resolves', function(hooks) {
      hooks.beforeEach(function() {
        sinon.stub(session, 'restore').returns(RSVP.resolve());
      });

      test('returns the return value of the original "beforeModel" method', async function(assert) {
        let value = await route.beforeModel();

        assert.equal(value, 'test');
      });
    });

    module('when session restoration rejects', function(hooks) {
      hooks.beforeEach(function() {
        sinon.stub(session, 'restore').returns(RSVP.reject());
      });

      test('returns the return value of the original "beforeModel" method', async function(assert) {
        let value = await route.beforeModel();

        assert.equal(value, 'test');
      });
    });
  });
});
