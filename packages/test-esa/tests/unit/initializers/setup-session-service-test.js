import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { registerDeprecationHandler } from '@ember/debug';
import sinonjs from 'sinon';
import InternalSession from 'ember-simple-auth/internal-session';
import SessionService from 'ember-simple-auth/services/session';

const SESSION_MAIN_DEPRECATION_ID = 'ember-simple-auth.session-main';

function collectDeprecations() {
  const deprecations = [];

  registerDeprecationHandler((message, options, next) => {
    deprecations.push({ message, options });
    next(message, options);
  });

  return deprecations;
}

module('setupSessionService', function (hooks) {
  setupTest(hooks);
  let sinon;

  hooks.beforeEach(function () {
    sinon = sinonjs.createSandbox();
  });

  hooks.afterEach(function () {
    sinon.restore();
  });

  test('injects the session into the session service', function (assert) {
    const deprecations = collectDeprecations();

    assert.equal(this.owner.lookup('service:session').session, this.owner.lookup('session:main'));
    assert.ok(
      deprecations.some(({ options }) => options.id === SESSION_MAIN_DEPRECATION_ID),
      'deprecates looking up session:main'
    );
  });

  test('creates InternalSession when session:main is not registered', function (assert) {
    this.owner.unregister('session:main');
    const deprecations = collectDeprecations();

    const service = this.owner.lookup('service:session');

    assert.ok(service.session instanceof InternalSession);
    assert.notOk(
      deprecations.some(({ options }) => options.id === SESSION_MAIN_DEPRECATION_ID),
      'does not deprecate when session:main is not used'
    );
  });

  test('uses an InternalSession assigned on the session service', function (assert) {
    this.owner.unregister('service:session');
    this.owner.register(
      'service:session',
      class extends SessionService {
        session = InternalSession.create(this);
      }
    );

    const service = this.owner.lookup('service:session');

    assert.ok(service.session instanceof InternalSession);
    assert.notEqual(service.session, this.owner.lookup('session:main'));
  });
});
