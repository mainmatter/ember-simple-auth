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
    test('looks up authenticators when no authenticators map is passed', function (assert) {
      this.owner.register('authenticator:test', TestAuthenticator);
      session = new InternalSession(this.owner);

      assert.equal(
        session._lookupAuthenticator('authenticator:test'),
        this.owner.lookup('authenticator:test')
      );
    });

    test('uses the authenticators map when it is passed', function (assert) {
      const store = new Ephemeral(this.owner);
      const authenticator = new TestAuthenticator(this.owner);
      session = new InternalSession(this.owner, store, {
        authenticators: {
          'authenticator:oauth2': authenticator,
        },
      });

      assert.equal(session._lookupAuthenticator('authenticator:oauth2'), authenticator);
    });

    test('asserts when useResolver is false and authenticators are missing', function (assert) {
      Configuration.load({ useResolver: false });
      const store = new Ephemeral(this.owner);
      session = new InternalSession(this.owner, store);

      assert.throws(
        () => session._lookupAuthenticator('authenticator:test'),
        /createAuthenticators/
      );
    });
  });
});
