import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { registerDeprecationHandler } from '@ember/debug';
import sinonjs from 'sinon';
import Configuration from 'ember-simple-auth/configuration';
import InternalSession from 'ember-simple-auth/internal-session';
import SessionService from 'ember-simple-auth/services/session';
import Ephemeral from 'ember-simple-auth/session-stores/ephemeral';
import TestAuthenticator from 'ember-simple-auth/authenticators/test';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import { authenticateSession } from 'ember-simple-auth/test-support';
import setupSession from 'ember-simple-auth/initializers/setup-session';
import emberSimpleAuthInitializer from 'ember-simple-auth/initializers/ember-simple-auth';

const SESSION_MAIN_DEPRECATION_ID = 'ember-simple-auth.session-main';

function collectDeprecations() {
  const deprecations = [];

  registerDeprecationHandler((message, options, next) => {
    deprecations.push({ message, options });
    next(message, options);
  });

  return deprecations;
}

function createRegistry() {
  const registrations = {};

  return {
    registrations,
    register(name, factory) {
      registrations[name] = factory;
    },
  };
}

module('setupSessionService', function (hooks) {
  setupTest(hooks);
  let sinon;

  hooks.beforeEach(function () {
    sinon = sinonjs.createSandbox();
  });

  hooks.afterEach(function () {
    Configuration.load({});
    sinon.restore();
  });

  test('looks up session:main when useResolver is true', function (assert) {
    const deprecations = collectDeprecations();

    assert.equal(this.owner.lookup('service:session').session, this.owner.lookup('session:main'));
    assert.ok(
      deprecations.some(({ options }) => options.id === SESSION_MAIN_DEPRECATION_ID),
      'deprecates looking up session:main'
    );
  });

  test('looks up session-store:test when useResolver is true', function (assert) {
    const service = this.owner.lookup('service:session');

    assert.equal(service.session.store, this.owner.lookup('session-store:test'));
  });

  test('default configuration uses registered authenticators without ids or factory hooks', async function (assert) {
    let initCalls = 0;
    const lookupAuthenticator = sinon.spy(InternalSession.prototype, '_lookupAuthenticator');
    this.owner.register(
      'authenticator:legacy',
      class LegacyAuthenticator extends BaseAuthenticator {
        init(...args) {
          super.init(...args);
          initCalls++;
        }

        authenticate(data) {
          return Promise.resolve(data);
        }

        restore(data) {
          return Promise.resolve(data);
        }
      }
    );
    this.owner.register(
      'service:session',
      class ApplicationSession extends SessionService {
        createAuthenticators() {
          throw new Error('createAuthenticators must require useResolver: false');
        }

        createSessionStore() {
          throw new Error('createSessionStore must require useResolver: false');
        }
      }
    );

    const service = this.owner.lookup('service:session');
    await service.authenticate('authenticator:legacy', { token: 'legacy-token' });
    await service.session.restore();

    assert.strictEqual(initCalls, 1, 'uses the registered singleton and its existing init hook');
    assert.ok(lookupAuthenticator.calledWith('authenticator:legacy'));
    assert.true(service.isAuthenticated);
    assert.strictEqual(service.data.authenticated.token, 'legacy-token');
    assert.strictEqual(service.data.authenticated.authenticator, 'authenticator:legacy');
  });

  test('authenticateSession respects a registered test authenticator by default', async function (assert) {
    this.owner.register(
      'authenticator:test',
      class ApplicationTestAuthenticator extends BaseAuthenticator {
        authenticate(data) {
          return Promise.resolve({ ...data, customAuthenticator: true });
        }
      }
    );

    await authenticateSession({ token: 'test-token' });
    const service = this.owner.lookup('service:session');

    assert.true(service.isAuthenticated);
    assert.true(service.data.authenticated.customAuthenticator);
    assert.strictEqual(service.data.authenticated.token, 'test-token');
  });

  test('constructs InternalSession when useResolver is false', function (assert) {
    Configuration.load({ useResolver: false });
    const deprecations = collectDeprecations();
    const originalLookup = this.owner.lookup.bind(this.owner);
    this.owner.lookup = (fullName, ...args) => {
      if (fullName === 'session:main') {
        return undefined;
      }

      return originalLookup(fullName, ...args);
    };

    this.owner.register(
      'service:session',
      class TestSession extends SessionService {
        createAuthenticators() {
          return [];
        }
      }
    );

    const service = this.owner.lookup('service:session');

    assert.ok(service.session instanceof InternalSession);
    assert.notOk(
      deprecations.some(({ options }) => options.id === SESSION_MAIN_DEPRECATION_ID),
      'does not deprecate when session:main is not used'
    );
  });

  test('createSessionStore constructs a store when useResolver is false', function (assert) {
    Configuration.load({ useResolver: false });

    this.owner.register(
      'service:session',
      class TestSession extends SessionService {
        createSessionStore(owner) {
          return new Ephemeral(owner);
        }

        createAuthenticators() {
          return [];
        }
      }
    );

    const service = this.owner.lookup('service:session');

    assert.ok(service.session.store instanceof Ephemeral);
  });

  test('asserts when createAuthenticators is missing when useResolver is false', function (assert) {
    Configuration.load({ useResolver: false });

    assert.throws(() => this.owner.lookup('service:session'), /createAuthenticators/);
  });

  test('createAuthenticators override is used when useResolver is false', async function (assert) {
    Configuration.load({ useResolver: false });

    this.owner.register(
      'service:session',
      class TestSession extends SessionService {
        createAuthenticators(owner) {
          return [new TestAuthenticator(owner)];
        }
      }
    );

    const service = this.owner.lookup('service:session');
    await service.session.authenticate('authenticator:test', { token: 't' });

    assert.true(service.session.isAuthenticated);
    assert.equal(service.session.content.authenticated.authenticator, 'authenticator:test');
  });

  test('restore uses the persisted authenticator name from createAuthenticators', async function (assert) {
    Configuration.load({ useResolver: false });

    this.owner.register(
      'service:session',
      class TestSession extends SessionService {
        createAuthenticators(owner) {
          return [new TestAuthenticator(owner)];
        }
      }
    );

    const service = this.owner.lookup('service:session');
    await service.session.store.persist({
      authenticated: { authenticator: 'authenticator:test', token: 't' },
    });
    await service.session.restore();

    assert.true(service.session.isAuthenticated);
  });

  test('uses Ephemeral when useResolver is false and createSessionStore is not overridden', function (assert) {
    Configuration.load({ useResolver: false });

    this.owner.register(
      'service:session',
      class TestSession extends SessionService {
        createAuthenticators() {
          return [];
        }
      }
    );

    const service = this.owner.lookup('service:session');

    assert.ok(service.session.store instanceof Ephemeral);
  });

  test('does not register session:main when useResolver is false', function (assert) {
    Configuration.load({ useResolver: false });
    const registry = createRegistry();

    setupSession(registry);

    assert.notOk(registry.registrations['session:main']);
  });

  test('registers session:main when useResolver is true', function (assert) {
    const registry = createRegistry();

    setupSession(registry);

    assert.ok(registry.registrations['session:main']);
  });

  test('asserts when useResolver is true and session:main is missing', function (assert) {
    const originalLookup = this.owner.lookup.bind(this.owner);
    this.owner.lookup = (fullName, ...args) => {
      if (fullName === 'session:main') {
        return undefined;
      }

      return originalLookup(fullName, ...args);
    };

    assert.throws(() => this.owner.lookup('service:session'));
  });

  test('registers session-store:test when useResolver is true', function (assert) {
    Configuration.load({ useResolver: true });
    const registry = createRegistry();

    setupSession(registry);

    assert.ok(registry.registrations['session-store:test']);
  });

  test('does not register session-store:test when useResolver is false', function (assert) {
    Configuration.load({ useResolver: false });
    const registry = createRegistry();

    setupSession(registry);

    assert.notOk(registry.registrations['session-store:test']);
  });

  test('registers built-in session stores when useResolver is true', function (assert) {
    const registry = {
      registrations: {},
      register(name, factory) {
        this.registrations[name] = factory;
      },
      resolveRegistration() {
        return { rootURL: '/', 'ember-simple-auth': {} };
      },
    };

    emberSimpleAuthInitializer.initialize(registry);

    assert.ok(registry.registrations['session-store:adaptive']);
    assert.ok(registry.registrations['session-store:cookie']);
    assert.ok(registry.registrations['session-store:local-storage']);
  });

  test('does not register built-in session stores when useResolver is false', function (assert) {
    const registry = {
      registrations: {},
      register(name, factory) {
        this.registrations[name] = factory;
      },
      resolveRegistration() {
        return { rootURL: '/', 'ember-simple-auth': { useResolver: false } };
      },
    };

    emberSimpleAuthInitializer.initialize(registry);

    assert.notOk(registry.registrations['session-store:adaptive']);
    assert.notOk(registry.registrations['session-store:cookie']);
    assert.notOk(registry.registrations['session-store:local-storage']);
  });
});
