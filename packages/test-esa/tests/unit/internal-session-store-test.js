import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import sinonjs from 'sinon';
import InternalSession from 'ember-simple-auth/internal-session';

module('InternalSession store injection', function (hooks) {
  setupApplicationTest(hooks);

  let sinon;
  let session;

  hooks.beforeEach(function () {
    sinon = sinonjs.createSandbox();
  });

  hooks.afterEach(function () {
    if (session && session !== this.owner.lookup('session:main')) {
      session.destroy();
    }
    sinon.restore();
  });

  module('session store injection', function () {
    test('looks up the test session store when isTesting()', function (assert) {
      session = this.owner.lookup('session:main');
      assert.equal(session.get('store'), this.owner.lookup('session-store:test'));
    });

    test('looks up the test session store when created without the resolver', function (assert) {
      session = new InternalSession(this.owner);
      assert.equal(session.get('store'), this.owner.lookup('session-store:test'));
    });
  });
});
