import Base from 'ember-simple-auth/authenticators/base';
import { module, test } from 'qunit';

module('Unit | authenticators | base', function(hooks) {
  let authenticator;

  hooks.beforeEach(function() {
    authenticator = Base.create();
  });

  test('restore returns a rejecting promise', async function(assert) {
    assert.expect(1);
    try {
      await authenticator.restore();
      assert.ok(false);
    } catch (_error) {
      assert.ok(true);
    }
  });

  test('authenticate returns a rejecting promise', async function(assert) {
    assert.expect(1);
    try {
      await authenticator.authenticate();
      assert.ok(false);
    } catch (_error) {
      assert.ok(true);
    }
  });

  test('returns a resolving promise', async function(assert) {
    assert.expect(1);
    try {
      await authenticator.invalidate();
      assert.ok(true);
    } catch (_error) {
      assert.ok(false);
    }
  });
});
