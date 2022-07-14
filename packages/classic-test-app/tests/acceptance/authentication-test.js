import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import {
  currentURL,
  visit,
  fillIn,
  click
} from '@ember/test-helpers';
import Pretender from 'pretender';
import {
  invalidateSession,
  authenticateSession,
  currentSession
} from 'ember-simple-auth/test-support';
import config from '../../config/environment';

module('Acceptance: Authentication', function(hooks) {
  setupApplicationTest(hooks);
  let server;

  hooks.afterEach(function() {
    if (server) {
      server.shutdown();
    }
  });

  test('logging in with correct credentials works', async function(assert) {
    server = new Pretender(function() {
      this.post(`${config.apiHost}/token`, () => [200, { 'Content-Type': 'application/json' }, '{ "access_token": "secret token!", "account_id": 1 }']);
      this.get(`${config.apiHost}/accounts/1`, () => [200, { 'Content-Type': 'application/json' }, '{ "data": { "type": "accounts", "id": "1", "attributes": { "login": "letme", "name": "Some person" } } }']);
    });

    await invalidateSession();
    await visit('/login');
    await fillIn('[data-test-identification]', 'identification');
    await fillIn('[data-test-password]', 'password');
    await click('button[type="submit"]');

    assert.equal(currentURL(), '/');
  });

  test('logging in with incorrect credentials shows an error', async function(assert) {
    server = new Pretender(function() {
      this.post(`${config.apiHost}/token`, () => [400, { 'Content-Type': 'application/json' }, '{ "error": "invalid_grant" }']);
    });

    await invalidateSession();
    await visit('/login');
    await fillIn('[data-test-identification]', 'identification');
    await fillIn('[data-test-password]', 'wrong-password!');
    await click('button[type="submit"]');

    assert.equal(currentURL(), '/login');
    assert.ok(document.querySelector('[data-test-error-message]'));
  });

  module('the protected route', function() {
    test('cannot be visited when the session is not authenticated', async function(assert) {
      await invalidateSession();
      await visit('/protected');

      assert.equal(currentURL(), '/login');
    });

    test('can be visited when the session is authenticated', async function(assert) {
      server = new Pretender(function() {
        this.get(`${config.apiHost}/posts`, () => [200, { 'Content-Type': 'application/json' }, '{"data":[]}']);
      });

      await authenticateSession({ userId: 1, otherData: 'some-data' });
      await visit('/protected');

      let session = currentSession();
      assert.equal(currentURL(), '/protected');
      assert.equal(session.get('data.authenticated.userId'), 1);
      assert.equal(session.get('data.authenticated.otherData'), 'some-data');
    });
  });

  module('the protected route in the engine', function() {
    test('cannot be visited when the session is not authenticated', async function(assert) {
      await invalidateSession();
      await visit('/engine');

      assert.equal(currentURL(), '/login');
    });

    test('can be visited when the session is authenticated', async function(assert) {
      server = new Pretender(function() {
        this.get(`${config.apiHost}/posts`, () => [200, { 'Content-Type': 'application/json' }, '{"data":[]}']);
      });
      await authenticateSession({ userId: 1, otherData: 'some-data' });
      await visit('/engine');

      assert.equal(currentURL(), '/engine');
      let session = currentSession();
      assert.equal(session.get('data.authenticated.userId'), 1);
      assert.equal(session.get('data.authenticated.otherData'), 'some-data');
    });

    test('can invalidate the session', async function(assert) {
      server = new Pretender(function() {
        this.get(`${config.apiHost}/posts`, () => [200, { 'Content-Type': 'application/json' }, '{"data":[]}']);
      });
      await authenticateSession({ userId: 1, otherData: 'some-data' });
      await visit('/engine');
      await click('[data-test-logout-button]');

      let session = currentSession();
      assert.notOk(session.get('isAuthenticated'));
    });
  });

  module('the login route', function() {
    test('can be visited when the session is not authenticated', async function(assert) {
      await invalidateSession();
      await visit('/login');

      assert.equal(currentURL(), '/login');
    });

    test('cannot be visited when the session is authenticated', async function(assert) {
      await authenticateSession();
      await visit('/login');

      assert.equal(currentURL(), '/');
    });
  });
});
