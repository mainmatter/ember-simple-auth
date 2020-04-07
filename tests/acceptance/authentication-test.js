import { tryInvoke } from '@ember/utils';
import {
  currentURL,
  visit,
  fillIn,
  click
} from '@ember/test-helpers';
import hasEmberVersion from 'ember-test-helpers/has-ember-version';
import {
  describe,
  it,
  afterEach
} from 'mocha';
import { setupApplicationTest } from 'ember-mocha';
import { expect } from 'chai';
import Pretender from 'pretender';
import {
  invalidateSession,
  authenticateSession,
  currentSession
} from 'ember-simple-auth/test-support';
import config from '../../config/environment';

describe('Acceptance: Authentication', function() {
  setupApplicationTest();
  let server;

  afterEach(function() {
    tryInvoke(server, 'shutdown');
  });

  it('logging in with correct credentials works', async function() {
    server = new Pretender(function() {
      this.post(`${config.apiHost}/token`, () => [200, { 'Content-Type': 'application/json' }, '{ "access_token": "secret token!", "account_id": 1 }']);
      this.get(`${config.apiHost}/accounts/1`, () => [200, { 'Content-Type': 'application/json' }, '{ "data": { "type": "accounts", "id": "1", "attributes": { "login": "letme", "name": "Some person" } } }']);
    });

    await invalidateSession();
    await visit('/login');
    await fillIn('[data-test-identification]', 'identification');
    await fillIn('[data-test-password]', 'password');
    await click('button[type="submit"]');

    expect(currentURL()).to.eq('/');
  });

  it('logging in with incorrect credentials shows an error', async function() {
    server = new Pretender(function() {
      this.post(`${config.apiHost}/token`, () => [400, { 'Content-Type': 'application/json' }, '{ "error": "invalid_grant" }']);
    });

    await invalidateSession();
    await visit('/login');
    await fillIn('[data-test-identification]', 'identification');
    await fillIn('[data-test-password]', 'wrong-password!');
    await click('button[type="submit"]');

    expect(currentURL()).to.eq('/login');
    expect(document.querySelector('[data-test-error-message]')).to.exist;
  });

  describe('the protected route', function() {
    if (!hasEmberVersion(2, 4)) {
      // guard against running test module on unsupported version (before 2.4)
      return;
    }

    it('cannot be visited when the session is not authenticated', async function() {
      await invalidateSession();
      await visit('/protected');

      expect(currentURL()).to.eq('/login');
    });

    it('can be visited when the session is authenticated', async function() {
      server = new Pretender(function() {
        this.get(`${config.apiHost}/posts`, () => [200, { 'Content-Type': 'application/json' }, '{"data":[]}']);
      });

      await authenticateSession({ userId: 1, otherData: 'some-data' });
      await visit('/protected');

      let session = currentSession();
      expect(currentURL()).to.eq('/protected');
      expect(session.get('data.authenticated.userId')).to.eql(1);
      expect(session.get('data.authenticated.otherData')).to.eql('some-data');
    });
  });

  describe('the protected route in the engine', function() {
    it('cannot be visited when the session is not authenticated', async function() {
      await invalidateSession();
      await visit('/engine');

      expect(currentURL()).to.eq('/login');
    });

    it('can be visited when the session is authenticated', async function() {
      server = new Pretender(function() {
        this.get(`${config.apiHost}/posts`, () => [200, { 'Content-Type': 'application/json' }, '{"data":[]}']);
      });
      await authenticateSession({ userId: 1, otherData: 'some-data' });
      await visit('/engine');

      expect(currentURL()).to.eq('/engine');
      let session = currentSession();
      expect(session.get('data.authenticated.userId')).to.eql(1);
      expect(session.get('data.authenticated.otherData')).to.eql('some-data');
    });

    it('can invalidate the session', async function() {
      server = new Pretender(function() {
        this.get(`${config.apiHost}/posts`, () => [200, { 'Content-Type': 'application/json' }, '{"data":[]}']);
      });
      await authenticateSession({ userId: 1, otherData: 'some-data' });
      await visit('/engine');
      await click('[data-test-logout-button]');

      let session = currentSession();
      expect(session.get('isAuthenticated')).to.be.false;
    });
  });

  describe('the login route', function() {
    if (!hasEmberVersion(2, 4)) {
      // guard against running test module on unsupported version (before 2.4)
      return;
    }

    it('can be visited when the session is not authenticated', async function() {
      await invalidateSession();
      await visit('/login');

      expect(currentURL()).to.eq('/login');
    });

    it('cannot be visited when the session is authenticated', async function() {
      await authenticateSession();
      await visit('/login');

      expect(currentURL()).to.eq('/');
    });
  });
});
