import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import Base from 'ember-simple-auth/authenticators/base';

describe('BaseAuthenticator', () => {
  let authenticator;

  beforeEach(function() {
    authenticator = Base.create();
  });

  describe('#restore', function() {
    it('returns a rejecting promise', async function() {
      try {
        await authenticator.restore();
        expect(false).to.be.true;
      } catch (_error) {
        expect(true).to.be.true;
      }
    });
  });

  describe('#authenticate', function() {
    it('returns a rejecting promise', async function() {
      try {
        await authenticator.authenticate();
        expect(false).to.be.true;
      } catch (_error) {
        expect(true).to.be.true;
      }
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
