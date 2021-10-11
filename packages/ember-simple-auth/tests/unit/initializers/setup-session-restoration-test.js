import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import sinonjs from 'sinon';
import setupSessionRestoration from 'ember-simple-auth/initializers/setup-session-restoration';

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

  module('the beforeModel method', function(hooks) {
    let session;
    let route;

    hooks.beforeEach(function() {
      this.owner.register('session:main', EmberObject.extend({
        restore() { }
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
