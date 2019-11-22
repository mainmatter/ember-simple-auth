import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import Test from 'ember-simple-auth/authenticators/test';

describe('TestAuthenticator', () => {
  let authenticator;

  beforeEach(function() {
    authenticator = Test.create();
  });

  describe('#restore', function() {
    it('returns a resolving promise', async function() {
      try {
        await authenticator.restore();
        expect(true).to.be.true;
      } catch (_error) {
        expect(false).to.be.true;
      }
    });

    it('resolves with session data', async function() {
      let data = await authenticator.restore({ userId: 1, otherData: 'some-data' });

      expect(data).to.eql({ userId: 1, otherData: 'some-data' });
    });
  });

  describe('#authenticate', function() {
    it('returns a resolving promise', async function() {
      try {
        await authenticator.authenticate();
        expect(true).to.be.true;
      } catch (_error) {
        expect(false).to.be.true;
      }
    });

    it('resolves with session data', async function() {
      let data = await authenticator.authenticate({ userId: 1, otherData: 'some-data' });

      expect(data).to.eql({ userId: 1, otherData: 'some-data' });
    });
  });

  describe('#invalidate', function() {
    it('returns a resolving promise', async function() {
      try {
        await authenticator.invalidate();
        expect(true).to.be.true;
      } catch (_error) {
        expect(false).to.be.true;
      }
    });
  });
});
