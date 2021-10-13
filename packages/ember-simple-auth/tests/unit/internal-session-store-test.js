import { module, test } from 'qunit';
import ENV from 'ember-get-config';
import { setupApplicationTest } from 'ember-qunit';
import sinonjs from 'sinon';

module('InternalSession store injection', function(hooks) {
  setupApplicationTest(hooks);

  let sinon;
  let session;

  hooks.beforeEach(function() {
    sinon = sinonjs.createSandbox();
  });

  hooks.afterEach(function() {
    sinon.restore();
  });

  module('session store injection', function(hooks) {
    hooks.afterEach(function() {
      ENV.environment = 'test'; // eslint-disable-line ember/no-ember-testing-in-module-scope
    });

    test('looks up the test session store when ENV.environment true', function(assert) {
      ENV.environment = 'test'; // eslint-disable-line ember/no-ember-testing-in-module-scope

      session = this.owner.lookup('session:main');
      assert.equal(session.get('store'), this.owner.lookup('session-store:test'));
    });

    test('looks up the application session store when ENV.environment false', function(assert) {
      ENV.environment = 'development'; // eslint-disable-line ember/no-ember-testing-in-module-scope

      session = this.owner.lookup('session:main');
      assert.equal(session.get('store'), this.owner.lookup('session-store:application'));
    });
  });
});
