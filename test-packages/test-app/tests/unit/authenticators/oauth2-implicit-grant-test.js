import { module, test } from 'qunit';
import OAuth2ImplicitGrant, { parseResponse } from 'ember-simple-auth/authenticators/oauth2-implicit-grant';

module('OAuth2ImplicitGrantAuthenticator', function(hooks) {
  let authenticator;

  let data = {
    'access_token': 'secret-token'
  };

  hooks.beforeEach(function() {
    authenticator = OAuth2ImplicitGrant.create();
  });

  module('parseResponse', function() {
    test('parses a URL into a data hash', function(assert) {
      let result = parseResponse('/routepath#access_token=secret-token&scope=something');

      assert.deepEqual(result, { access_token: 'secret-token', scope: 'something' });
    });

    test('parses a URL into a data hash when the app uses hash routing', function(assert) {
      let result = parseResponse('#/routepath#access_token=secret-token&scope=something');

      assert.deepEqual(result, { access_token: 'secret-token', scope: 'something' });
    });
  });

  module('#restore', function() {
    module('when the data contains an access_token', function() {
      test('resolves with the correct data', async function(assert) {
        let _data = await authenticator.restore(data);

        assert.equal(_data, data);
      });

      module('when the data does not contain an access_token', function() {
        test('returns a rejecting promise', async function(assert) {
          assert.expect(1);
          try {
            await authenticator.restore();
            assert.ok(false);
          } catch (error) {
            assert.equal(error, 'Could not restore session - "access_token" missing.');
          }
        });
      });
    });
  });

  module('#authenticate', function() {
    module('when the data contains an access_token', function() {
      test('resolves with the correct data', async function(assert) {
        let _data = await authenticator.authenticate(data);

        assert.equal(_data, data);
      });
    });

    module('when the data does not contain an access_token', function() {
      test('rejects with an error', async function(assert) {
        assert.expect(1);
        try {
          await authenticator.authenticate({ foo: 'bar' });
          assert.ok(false);
        } catch (error) {
          assert.equal(error, 'Invalid auth params - "access_token" missing.');
        }
      });
    });

    module('when the data contains an error', function() {
      test('rejects with that error', async function(assert) {
        assert.expect(1);
        try {
          await authenticator.authenticate({ error: 'access_denied' });
          assert.ok(false);
        } catch (error) {
          assert.equal(error, 'access_denied');
        }
      });
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
