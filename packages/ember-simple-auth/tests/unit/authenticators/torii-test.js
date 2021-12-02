import RSVP from 'rsvp';
import { module, test } from 'qunit';
import sinonjs from 'sinon';
import Torii from 'ember-simple-auth/authenticators/torii';

module('ToriiAuthenticator', function(hooks) {
  let sinon;
  let authenticator;
  let torii;

  hooks.beforeEach(function() {
    sinon = sinonjs.createSandbox();
    torii = {
      fetch() {},
      open() {},
      close() {}
    };
    authenticator = Torii.create({ torii });
  });

  hooks.afterEach(function() {
    sinon.restore();
  });

  module('#restore', function() {
    function itDoesNotRestore(data) {
      test('returns a rejecting promise', async function(assert) {
        assert.expect(1);
        try {
          await authenticator.restore(data);
          assert.ok(false);
        } catch (_error) {
          assert.ok(true);
        }
      });
    }

    test('throws if torii is not installed', async function(assert) {
      assert.expect(1);
      authenticator.set('torii', null);

      try {
        await authenticator.restore();
        assert.ok(false);
      } catch (_error) {
        assert.ok(true);
      }
    });

    module('when there is a torii provider in the session data', function() {
      module('when torii fetches successfully', function(hooks) {
        hooks.beforeEach(function() {
          sinon.stub(torii, 'fetch').returns(RSVP.resolve({ some: 'other data' }));
        });

        test('returns a promise that resolves with the session data merged with the data fetched from torri', async function(assert) {
          let data = await authenticator.restore({ some: 'data', provider: 'provider', another: 'prop' });

          assert.deepEqual(data, { some: 'other data', provider: 'provider', another: 'prop' });
        });
      });

      module('when torii does not fetch successfully', function(hooks) {
        hooks.beforeEach(function() {
          sinon.stub(torii, 'fetch').returns(RSVP.reject());
        });

        itDoesNotRestore({ some: 'data', provider: 'provider' });
      });
    });

    module('when there is no torii provider in the session data', function() {
      itDoesNotRestore();
    });
  });

  module('#authenticate', function() {
    test('throws if torii is not installed', async function(assert) {
      assert.expect(1);
      authenticator.set('torii', null);

      try {
        await authenticator.authenticate();
        assert.ok(false);
      } catch (_error) {
        assert.ok(true);
      }
    });

    module('when torii opens successfully', function(hooks) {
      hooks.beforeEach(function() {
        sinon.stub(torii, 'open').returns(RSVP.resolve({ some: 'data' }));
      });

      test('returns a promise that resolves with the session data', async function(assert) {
        let data = await authenticator.authenticate('provider');

        assert.deepEqual(data, { some: 'data', provider: 'provider' });
      });
    });

    module('when torii does not open successfully', function(hooks) {
      hooks.beforeEach(function() {
        sinon.stub(torii, 'open').returns(RSVP.reject());
      });

      test('returns a rejecting promise', async function(assert) {
        assert.expect(1);
        try {
          await authenticator.authenticate('provider');
          assert.ok(false);
        } catch (_error) {
          assert.ok(true);
        }
      });
    });
  });

  module('#invalidate', function() {
    module('when torii closes successfully', function(hooks) {
      hooks.beforeEach(function() {
        sinon.stub(torii, 'close').returns(RSVP.resolve());
      });

      test('returns a resolving promise', async function(assert) {
        assert.expect(1);
        try {
          await authenticator.invalidate({ some: 'data' });
          assert.ok(true);
        } catch (_error) {
          assert.ok(false);
        }
      });
    });

    module('when torii does not close successfully', function(hooks) {
      hooks.beforeEach(function() {
        sinon.stub(torii, 'close').returns(RSVP.reject());
      });

      test('returns a rejecting promise', async function(assert) {
        assert.expect(1);
        try {
          await authenticator.invalidate({ some: 'data' });
          assert.ok(false);
        } catch (_error) {
          assert.ok(true);
        }
      });
    });
  });
});
