import Pretender from 'pretender';
import Devise from 'ember-simple-auth/authenticators/devise';
import { module, test } from 'qunit';

module('DeviseAuthenticator', function(hooks) {
  let server;
  let authenticator;

  hooks.beforeEach(function() {
    server = new Pretender();
    authenticator = Devise.create();
  });

  hooks.afterEach(function() {
    if (server) {
      server.shutdown();
    }
  });

  module('#restore', function() {
    module('when the data contains a token and email', function() {
      test('resolves with the correct data', async function(assert) {
        let content = await authenticator.restore({ token: 'secret token!', email: 'user@email.com' });

        assert.deepEqual(content, { token: 'secret token!', email: 'user@email.com' });
      });
    });

    module('when the data contains a custom token and email attribute', function(hooks) {
      hooks.beforeEach(function() {
        authenticator = Devise.extend({ resourceName: 'employee', tokenAttributeName: 'token', identificationAttributeName: 'email' }).create();
      });

      test('resolves with the correct data', async function(assert) {
        let content = await authenticator.restore({ employee: { token: 'secret token!', email: 'user@email.com' } });

        assert.deepEqual(content, { employee: { token: 'secret token!', email: 'user@email.com' } });
      });
    });
  });

  module('#authenticate', function(hooks) {
    hooks.beforeEach(function() {
      server.post('/users/sign_in', () => [201, { 'Content-Type': 'application/json' }, '{ "token": "secret token!", "email": "email@address.com" }']);
    });

    test('sends an AJAX request to the sign in endpoint', async function(assert) {
      await authenticator.authenticate('identification', 'password');
      let [request] = server.handledRequests;

      assert.equal(request.url, '/users/sign_in');
      assert.equal(request.method, 'POST');
      assert.deepEqual(JSON.parse(request.requestBody), { user: { email: 'identification', password: 'password' } });
      assert.equal(request.requestHeaders['content-type'], 'application/json');
      assert.equal(request.requestHeaders.accept, 'application/json');
    });

    module('when the authentication request is successful', function(hooks) {
      hooks.beforeEach(function() {
        server.post('/users/sign_in', () => [201, { 'Content-Type': 'application/json' }, '{ "token": "secret token!", "email": "email@address.com" }']);
      });

      test('resolves with the correct data', async function(assert) {
        let data = await authenticator.authenticate('email@address.com', 'password');

        assert.deepEqual(data, { token: 'secret token!', email: 'email@address.com' });
      });

      module('when the server returns incomplete data', function() {
        test('fails when token is missing', async function(assert) {
          assert.expect(1);
          server.post('/users/sign_in', () => [201, { 'Content-Type': 'application/json' }, '{ "email": "email@address.com" }']);

          try {
            await authenticator.authenticate('email@address.com', 'password');
            assert.ok(false);
          } catch (error) {
            assert.equal(error, 'Check that server response includes token and email');
          }
        });

        test('fails when identification is missing', async function(assert) {
          assert.expect(1);
          server.post('/users/sign_in', () => [201, { 'Content-Type': 'application/json' }, '{ "token": "secret token!" }']);

          try {
            await authenticator.authenticate('email@address.com', 'password');
            assert.ok(false);
          } catch (error) {
            assert.equal(error, 'Check that server response includes token and email');
          }
        });
      });
    });

    module('when the authentication request fails', function(hooks) {
      hooks.beforeEach(function() {
        server.post('/users/sign_in', () => [400, { 'Content-Type': 'application/json', 'X-Custom-Context': 'foobar' }, '{ "error": "invalid_grant" }']);
      });

      test('when the authentication request fails - rejects with the response', async function(assert) {
        assert.expect(1);
        try {
          await authenticator.authenticate('username', 'password');
          assert.ok(false);
        } catch (response) {
          assert.notOk(response.ok);
        }
      });
    });

    test('can customize the ajax request', async function(assert) {
      server.put('/login', () => [201, { 'Content-Type': 'application/json' }, '{ "token": "secret token!", "email": "email@address.com" }']);

      authenticator = Devise.extend({
        makeRequest(config) {
          return this._super(config, { method: 'PUT', url: '/login' });
        }
      }).create();

      await authenticator.authenticate('identification', 'password');

      let [request] = server.handledRequests;

      assert.equal(request.url, '/login');
      assert.equal(request.method, 'PUT');
    });

    test('can handle a resp with the namespace of the resource name', async function(assert) {
      server.post('/users/sign_in', () => [201, { 'Content-Type': 'application/json' }, '{ "user": { "token": "secret token!", "email": "email@address.com" } }']);

      let data = await authenticator.authenticate('email@address.com', 'password');

      assert.deepEqual(data, { token: 'secret token!', email: 'email@address.com' });
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
});
