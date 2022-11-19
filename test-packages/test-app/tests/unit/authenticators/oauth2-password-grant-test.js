import { computed } from '@ember/object';
import { setOwner } from '@ember/application';
import Pretender from 'pretender';
import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('OAuth2PasswordGrantAuthenticator', function(hooks) {
  setupTest(hooks);

  let authenticator;
  let server;
  let parsePostData = ((query) => {
    let result = {};
    query.split('&').forEach((part) => {
      let item = part.split('=');
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  });

  hooks.beforeEach(function() {
    authenticator = OAuth2PasswordGrant.create();
    setOwner(authenticator, this.owner);
    server = new Pretender();
  });

  hooks.afterEach(function() {
    if (server) {
      server.shutdown();
    }
  });

  module('#restore', function() {
    module('when the data includes expiration data', function() {
      test('resolves with the correct data', async function(assert) {
        let data = await authenticator.restore({ 'access_token': 'secret token!', 'expires_in': 12345, 'refresh_token': 'refresh token!' });

        assert.deepEqual(data, { 'access_token': 'secret token!', 'expires_in': 12345, 'refresh_token': 'refresh token!' });
      });

      module('when the data includes an expiration time in the past', function() {
        module('when automatic token refreshing is enabled', function() {
          module('when the refresh request is successful', function(hooks) {
            hooks.beforeEach(function() {
              server.post('/token', () => [200, { 'Content-Type': 'application/json' }, '{ "access_token": "secret token 2!", "expires_in": 67890, "refresh_token": "refresh token 2!" }']);
            });

            test('resolves with the correct data', async function(assert) {
              let data = await authenticator.restore({ 'access_token': 'secret token!', 'expires_at': 1 });

              assert.true(data['expires_at'] > new Date().getTime());
              delete data['expires_at'];
              assert.deepEqual(data, { 'access_token': 'secret token 2!', 'expires_in': 67890, 'refresh_token': 'refresh token 2!' });
            });
          });

          module('when the access token is not refreshed successfully', function() {
            test('returns a rejecting promise', async function(assert) {
              assert.expect(1);
              try {
                await authenticator.restore({ 'access_token': 'secret token!', 'expires_at': 1 });
                assert.ok(false);
              } catch (_error) {
                assert.ok(true);
              }
            });
          });
        });

        module('when automatic token refreshing is disabled', function(hooks) {
          hooks.beforeEach(function() {
            authenticator.set('refreshAccessTokens', false);
          });

          test('returns a rejecting promise', async function(assert) {
            assert.expect(1);
            try {
              await authenticator.restore({ 'access_token': 'secret token!', 'expires_at': 1 });
              assert.ok(false);
            } catch (_error) {
              assert.ok(true);
            }
          });
        });
      });
    });

    module('when the data does not include expiration data', function() {
      module('when the data contains an access_token', function() {
        test('resolves with the correct data', async function(assert) {
          let data = await authenticator.restore({ 'access_token': 'secret token!' });

          assert.deepEqual(data, { 'access_token': 'secret token!' });
        });
      });

      module('when the data does not contain an access_token', function() {
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
    });
  });

  module('#authenticate', function() {
    test('sends an AJAX request to the token endpoint1', async function(assert) {
      assert.expect(1);
      server.post('/token', (request) => {
        let body = parsePostData(request.requestBody);

        assert.deepEqual(body, {
          'grant_type': 'password',
          'username': 'username',
          'password': 'password'
        });

        return [200, { 'Content-Type': 'application/json' }, '{ "access_token": "secret token!" }'];
      });

      await authenticator.authenticate('username', 'password');
    });

    test('sends an AJAX request to the token endpoint with client_id as parameter in the body', async function(assert) {
      assert.expect(1);
      server.post('/token', (request) => {
        let body = parsePostData(request.requestBody);

        assert.deepEqual(body, {
          'client_id': 'test-client',
          'grant_type': 'password',
          'username': 'username',
          'password': 'password'
        });

        return [200, { 'Content-Type': 'application/json' }, '{ "access_token": "secret token!" }'];
      });

      authenticator.set('clientId', 'test-client');
      await authenticator.authenticate('username', 'password');
    });

    test('sends an AJAX request to the token endpoint with customized headers', async function(assert) {
      assert.expect(1);
      server.post('/token', (request) => {
        assert.equal(request.requestHeaders['X-Custom-Context'], 'foobar');

        return [200, { 'Content-Type': 'application/json' }, '{ "access_token": "secret token!" }'];
      });

      await authenticator.authenticate('username', 'password', [], { 'X-Custom-Context': 'foobar' });
    });

    test('sends a single OAuth scope to the token endpoint', async function(assert) {
      assert.expect(1);
      server.post('/token', (request) => {
        let { requestBody } = request;
        let { scope } = parsePostData(requestBody);

        assert.equal(scope, 'public');

        return [200, { 'Content-Type': 'application/json' }, '{ "access_token": "secret token!" }'];
      });

      await authenticator.authenticate('username', 'password', 'public');
    });

    test('sends multiple OAuth scopes to the token endpoint', async function(assert) {
      assert.expect(1);
      server.post('/token', (request) => {
        let { requestBody } = request;
        let { scope } = parsePostData(requestBody);

        assert.equal(scope, 'public private');

        return [200, { 'Content-Type': 'application/json' }, '{ "access_token": "secret token!" }'];
      });

      await authenticator.authenticate('username', 'password', ['public', 'private']);
    });

    module('when the authentication request is successful', function(hooks) {
      hooks.beforeEach(function() {
        server.post('/token', () => [200, { 'Content-Type': 'application/json' }, '{ "access_token": "secret token!" }']);
      });

      test('resolves with the correct data', async function(assert) {
        authenticator.set('refreshAccessTokens', false);
        let data = await authenticator.authenticate('username', 'password');

        assert.deepEqual(data, { 'access_token': 'secret token!' });
      });

      module('when the server response includes expiration data', function(hooks) {
        hooks.beforeEach(function() {
          server.post('/token', () => [200, { 'Content-Type': 'application/json' }, '{ "access_token": "secret token!", "expires_in": 12345, "refresh_token": "refresh token!" }']);
        });

        test('resolves with the correct data', async function(assert) {
          let data = await authenticator.authenticate('username', 'password');

          assert.true(data['expires_at'] > new Date().getTime());
          delete data['expires_at'];
          assert.deepEqual(data, { 'access_token': 'secret token!', 'expires_in': 12345, 'refresh_token': 'refresh token!' });
        });
      });

      module('when the server response is missing access_token', function() {
        test('fails with a string describing the issue', async function(assert) {
          assert.expect(1);
          server.post('/token', () => [200, { 'Content-Type': 'application/json' }, '{}']);

          try {
            await authenticator.authenticate('username', 'password');
            assert.ok(false);
          } catch (error) {
            assert.equal(error, 'access_token is missing in server response');
          }
        });
      });

      module('but the response is not valid JSON', function() {
        test('fails with the string of the response', async function(assert) {
          assert.expect(1);
          server.post('/token', () => [200, { 'Content-Type': 'text/plain' }, 'Something went wrong']);

          try {
            await authenticator.authenticate('username', 'password');
            assert.ok(false);
          } catch (error) {
            assert.equal(error.responseText, 'Something went wrong');
          }
        });
      });
    });

    module('when the authentication request fails', function(hooks) {
      hooks.beforeEach(function() {
        server.post('/token', () => [400, { 'Content-Type': 'application/json', 'X-Custom-Context': 'foobar' }, '{ "error": "invalid_grant" }']);
      });

      test('rejects with response object containing responseJSON', async function(assert) {
        assert.expect(1);
        try {
          await authenticator.authenticate('username', 'password');
          assert.ok(false);
        } catch (error) {
          assert.deepEqual(error.responseJSON, { error: 'invalid_grant' });
        }
      });

      test('provides access to custom headers', async function(assert) {
        assert.expect(1);
        try {
          await authenticator.authenticate('username', 'password');
          assert.ok(false);
        } catch (error) {
          assert.equal(error.headers.get('x-custom-context'), 'foobar');
        }
      });
    });

    module('when the authentication request fails without a valid response', function(hooks) {
      hooks.beforeEach(function() {
        server.post('/token', () => [500, { 'Content-Type': 'text/plain', 'X-Custom-Context': 'foobar' }, 'The server has failed completely.']);
      });

      test('rejects with response object containing responseText', async function(assert) {
        assert.expect(2);
        try {
          await authenticator.authenticate('username', 'password');
          assert.ok(false);
        } catch (error) {
          assert.notOk(error.responseJSON);
          assert.equal(error.responseText, 'The server has failed completely.');
        }
      });

      test('provides access to custom headers', async function(assert) {
        assert.expect(1);
        try {
          await authenticator.authenticate('username', 'password');
          assert.ok(false);
        } catch (error) {
          assert.equal(error.headers.get('X-Custom-Context'), 'foobar');
        }
      });
    });
  });

  module('#invalidate', function() {
    function itSuccessfullyInvalidatesTheSession() {
      test('returns a resolving promise', async function(assert) {
        assert.expect(1);
        try {
          await authenticator.invalidate({ 'access_token': 'access token!' });
          assert.ok(true);
        } catch (_error) {
          assert.ok(false);
        }
      });
    }

    module('when token revokation is enabled', function(hooks) {
      hooks.beforeEach(function() {
        authenticator.serverTokenRevocationEndpoint = '/revoke';
      });

      test('sends an AJAX request to the revokation endpoint', async function(assert) {
        assert.expect(1);
        server.post('/revoke', (request) => {
          let { requestBody } = request;
          let body = parsePostData(requestBody);

          assert.deepEqual(body, {
            'token_type_hint': 'access_token',
            'token': 'access token!'
          });
        });

        await authenticator.invalidate({ 'access_token': 'access token!' });
      });

      module('when the revokation request is successful', function(hooks) {
        hooks.beforeEach(function() {
          server.post('/revoke', () => [200, {}, '']);
        });

        itSuccessfullyInvalidatesTheSession();
      });

      module('when the revokation request fails', function(hooks) {
        hooks.beforeEach(function() {
          server.post('/token', () => [400, { 'Content-Type': 'application/json' }, '{ "error": "unsupported_grant_type" }']);
        });

        itSuccessfullyInvalidatesTheSession();
      });

      module('when a refresh token is set', function() {
        test('sends an AJAX request to invalidate the refresh token', async function(assert) {
          assert.expect(1);
          server.post('/revoke', (request) => {
            let { requestBody } = request;
            let body = parsePostData(requestBody);

            if (body.token_type_hint === 'refresh_token') {
              // eslint-disable-next-line qunit/no-conditional-assertions
              assert.deepEqual(body, {
                'token_type_hint': 'refresh_token',
                'token': 'refresh token!'
              });
            }
          });

          await authenticator.invalidate({ 'access_token': 'access token!', 'refresh_token': 'refresh token!' });
        });
      });
    });

    module('when token revokation is not enabled', function() {
      itSuccessfullyInvalidatesTheSession();
    });
  });

  module('#tokenRefreshOffset', function() {
    test('returns a number between 5000 and 10000', function(assert) {
      assert.true(authenticator.get('tokenRefreshOffset') >= 5000);
      assert.true(authenticator.get('tokenRefreshOffset') < 10000);
    });

    test('can be overridden in a subclass', function(assert) {
      let authenticator = OAuth2PasswordGrant.extend({
        tokenRefreshOffset: computed(function() {
          return 42;
        }),
      }).create();

      assert.equal(authenticator.get('tokenRefreshOffset'), 42);
    });
  });

  // testing private API here ;(
  module('#_refreshAccessToken', function() {
    test('sends an AJAX request to the token endpoint2', async function(assert) {
      assert.expect(1);
      server.post('/token', (request) => {
        let { requestBody } = request;
        let body = parsePostData(requestBody);

        assert.deepEqual(body, {
          'grant_type': 'refresh_token',
          'refresh_token': 'refresh token!'
        });

        return [200, { 'Content-Type': 'application/json' }, '{}'];
      });

      await authenticator._refreshAccessToken(12345, 'refresh token!');
    });

    module('when the refresh request is successful', function(hooks) {
      hooks.beforeEach(function() {
        server.post('/token', () => [200, { 'Content-Type': 'application/json' }, '{ "access_token": "secret token 2!" }']);
      });

      test('triggers the "sessionDataUpdated" event', async function(assert) {
        assert.expect(2);
        await new Promise(resolve => {
          authenticator.one('sessionDataUpdated', (data) => {
            assert.true(data['expires_at'] > new Date().getTime());
            delete data['expires_at'];
            assert.deepEqual(data, { 'access_token': 'secret token 2!', 'expires_in': 12345, 'refresh_token': 'refresh token!' });

            resolve();
          });

          authenticator._refreshAccessToken(12345, 'refresh token!');
        });
      });

      module('when the server response includes updated expiration data', function(hooks) {
        hooks.beforeEach(function() {
          server.post('/token', () => [200, { 'Content-Type': 'application/json' }, '{ "access_token": "secret token 2!", "expires_in": 67890, "refresh_token": "refresh token 2!" }']);
        });

        test('triggers the "sessionDataUpdated" event with the correct data', async function(assert) {
          assert.expect(2);
          await new Promise(resolve => {
            authenticator.one('sessionDataUpdated', (data) => {
              assert.true(data['expires_at'] > new Date().getTime());
              delete data['expires_at'];
              assert.deepEqual(data, { 'access_token': 'secret token 2!', 'expires_in': 67890, 'refresh_token': 'refresh token 2!' });
              resolve();
            });

            authenticator._refreshAccessToken(12345, 'refresh token!');
          });
        });
      });
    });
  });
});
