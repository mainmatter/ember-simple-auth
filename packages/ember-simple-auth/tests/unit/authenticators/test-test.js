import { module, test } from 'qunit';
import Test from 'ember-simple-auth/authenticators/test';

module('TestAuthenticator', function(hooks) {
  let authenticator;

  hooks.beforeEach(function() {
    authenticator = Test.create();
  });

  module('#restore', function(hooks) {
    test('returns a resolving promise', async function(assert) {
      try {
        await authenticator.restore();
        assert.ok(true);
      } catch (_error) {
        assert.ok(false);
      }
    });

    test('resolves with session data', async function(assert) {
      let data = await authenticator.restore({ userId: 1, otherData: 'some-data' });

      assert.deepEqual(data, { userId: 1, otherData: 'some-data' });
    });
  });

  module('#authenticate', function(hooks) {
    test('returns a resolving promise', async function(assert) {
      try {
        await authenticator.authenticate();
        assert.ok(true);
      } catch (_error) {
        assert.ok(false);
      }
    });

    test('resolves with session data', async function(assert) {
      let data = await authenticator.authenticate({ userId: 1, otherData: 'some-data' });

      assert.deepEqual(data, { userId: 1, otherData: 'some-data' });
    });
  });

  module('#invalidate', function(hooks) {
    test('returns a resolving promise', async function(assert) {
      try {
        await authenticator.invalidate();
        assert.ok(true);
      } catch (_error) {
        assert.ok(false);
      }
    });
  });
});
