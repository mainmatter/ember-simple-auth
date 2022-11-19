import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinonjs from 'sinon';

module('setupSessionService', function(hooks) {
  setupTest(hooks);
  let sinon;

  hooks.beforeEach(function() {
    sinon = sinonjs.createSandbox();
  });

  hooks.afterEach(function() {
    sinon.restore();
  });

  test('injects the session into the session service', function(assert) {
    assert.equal(this.owner.lookup('service:session').session, this.owner.lookup('session:main'));
  });
});
