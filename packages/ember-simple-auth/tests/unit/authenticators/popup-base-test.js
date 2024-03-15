import PopupBaseAuthenticator from 'ember-simple-auth/authenticators/popup-base';
import { module, test } from 'qunit';

module('PopupBaseAuthenticator', function(hooks) {
  let authenticator;

  hooks.beforeEach(function() {
    authenticator = PopupBaseAuthenticator.create();
  });

  module('#restore', function() {
    test('returns a rejecting promise', async function(assert) {
      assert.expect(1);
      try {
        await authenticator.restore();
        assert.ok(false);
      } catch (_error) {
        assert.ok(true);
      }
    });
  });

  module('#authenticate', function() {
    test('returns a rejecting promise', async function(assert) {
      assert.expect(1);
      try {
        await authenticator.authenticate();
        assert.ok(false);
      } catch (_error) {
        assert.ok(true);
      }
    });
  });

  module('#invalidate', function() {
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
});
