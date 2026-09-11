import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import sinonjs from 'sinon';
import Configuration from 'ember-simple-auth/configuration';
import InternalSession from 'ember-simple-auth/internal-session';
import Ephemeral from 'ember-simple-auth/session-stores/ephemeral';
import TestAuthenticator from 'ember-simple-auth/authenticators/test';

module('InternalSession store injection', function (hooks) {
  setupApplicationTest(hooks);

  let sinon;
  let session;

  hooks.beforeEach(function () {
    sinon = sinonjs.createSandbox();
  });

  hooks.afterEach(function () {
    Configuration.load({});
    if (session && session !== this.owner.lookup('session:main')) {
      session.destroy();
    }
    sinon.restore();
  });

  module('session store injection', function () {
    test('looks up the test session store when no store is passed', function (assert) {
      session = new InternalSession(this.owner);

      assert.equal(session.get('store'), this.owner.lookup('session-store:test'));
    });

    test('uses the store passed to the constructor', function (assert) {
      const store = new Ephemeral(this.owner);
      session = new InternalSession(this.owner, store);

      assert.equal(session.get('store'), store);
    });

    test('asserts when constructed without a session store', function (assert) {
      Configuration.load({ useResolver: false });

      assert.throws(() => new InternalSession(this.owner));
    });
  });

  module('authenticator creation', function () {
    class OAuth2Authenticator extends TestAuthenticator {
      static id = 'oauth2';
    }

    class ToriiAuthenticator extends TestAuthenticator {
      static id = 'torii';
    }

    test('looks up authenticators when no authenticators map is passed', function (assert) {
      this.owner.register('authenticator:test', TestAuthenticator);
      session = new InternalSession(this.owner);

      assert.equal(
        session._findAuthenticator('authenticator:test'),
        this.owner.lookup('authenticator:test')
      );
    });

    test('uses the authenticators map when it is passed', function (assert) {
      const store = new Ephemeral(this.owner);
      const authenticator = new TestAuthenticator(this.owner);
      session = new InternalSession(this.owner, store, {
        authenticators: [authenticator],
      });

      assert.equal(session._findAuthenticator('authenticator:test'), authenticator);
    });

    test('findAuthenticator falls back to the registry when the list has no match', function (assert) {
      this.owner.register('authenticator:oauth2', OAuth2Authenticator);
      const store = new Ephemeral(this.owner);
      const listed = new TestAuthenticator(this.owner);
      session = new InternalSession(this.owner, store, {
        authenticators: [listed],
      });

      assert.equal(
        session._findAuthenticator('authenticator:oauth2'),
        this.owner.lookup('authenticator:oauth2')
      );
    });

    test('findAuthenticator looks up authenticators by id', function (assert) {
      const store = new Ephemeral(this.owner);
      const authenticator = new OAuth2Authenticator(this.owner);
      session = new InternalSession(this.owner, store, {
        authenticators: [authenticator],
      });

      assert.equal(session._findAuthenticator('oauth2'), authenticator);
    });

    test('findAuthenticator looks up authenticators by class', function (assert) {
      const store = new Ephemeral(this.owner);
      const authenticator = new OAuth2Authenticator(this.owner);
      session = new InternalSession(this.owner, store, {
        authenticators: [authenticator],
      });

      assert.equal(session._findAuthenticator(OAuth2Authenticator), authenticator);
    });

    test('findAuthenticator looks up authenticators by instance', function (assert) {
      const store = new Ephemeral(this.owner);
      const authenticator = new OAuth2Authenticator(this.owner);
      session = new InternalSession(this.owner, store, {
        authenticators: [authenticator],
      });

      assert.equal(session._findAuthenticator(authenticator), authenticator);
    });

    test('asserts when useResolver is false and authenticators are missing', function (assert) {
      Configuration.load({ useResolver: false });
      const store = new Ephemeral(this.owner);
      session = new InternalSession(this.owner, store);

      assert.throws(
        () => session._findAuthenticator('authenticator:test'),
        /createAuthenticators/
      );
    });

    test('asserts when authenticators is not an array', function (assert) {
      const store = new Ephemeral(this.owner);
      const authenticator = new OAuth2Authenticator(this.owner);

      assert.throws(
        () =>
          new InternalSession(this.owner, store, {
            authenticators: { oauth2: authenticator },
          }),
        /array of authenticator instances/
      );
    });

    test('asserts when an authenticator is missing a static id', function (assert) {
      const store = new Ephemeral(this.owner);
      class NoIdAuthenticator extends TestAuthenticator {}
      NoIdAuthenticator.id = undefined;

      assert.throws(
        () =>
          new InternalSession(this.owner, store, {
            authenticators: [new NoIdAuthenticator(this.owner)],
          }),
        /static id/
      );
    });

    test('asserts when authenticator ids are duplicated', function (assert) {
      const store = new Ephemeral(this.owner);

      assert.throws(
        () =>
          new InternalSession(this.owner, store, {
            authenticators: [
              new TestAuthenticator(this.owner),
              new TestAuthenticator(this.owner),
            ],
          }),
        /duplicate authenticator id "test"/
      );
    });

    test('asserts when a class matches multiple authenticators', function (assert) {
      const store = new Ephemeral(this.owner);
      session = new InternalSession(this.owner, store, {
        authenticators: [
          new OAuth2Authenticator(this.owner),
          new ToriiAuthenticator(this.owner),
        ],
      });

      assert.throws(
        () => session._findAuthenticator(TestAuthenticator),
        /Multiple authenticators/
      );
    });

    test('asserts when no authenticator matches', function (assert) {
      const store = new Ephemeral(this.owner);
      session = new InternalSession(this.owner, store, {
        authenticators: [new OAuth2Authenticator(this.owner)],
      });

      assert.throws(
        () => session._findAuthenticator('authenticator:foo'),
        /No authenticator for factory "authenticator:foo" could be found!/
      );
    });
  });
});
