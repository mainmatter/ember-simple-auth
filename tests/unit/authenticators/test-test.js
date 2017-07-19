import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import Test from 'ember-simple-auth/authenticators/test';

describe('TestAuthenticator', () => {
  let authenticator;

  beforeEach(function() {
    authenticator = Test.create();
  });

  describe('#restore', function() {
    it('returns a resolving promise', function() {
      return authenticator.restore().then(() => {
        expect(true).to.be.true;
      });
    });

    it('resolves with session data', function() {
      return authenticator.restore({ userId: 1, otherData: 'some-data' }).then((data) => {
        expect(data).to.eql({ userId: 1, otherData: 'some-data' });
      });
    });
  });

  describe('#authenticate', function() {
    it('returns a resolving promise', function() {
      return authenticator.authenticate().then(() => {
        expect(true).to.be.true;
      });
    });

    it('resolves with session data', function() {
      return authenticator.authenticate({ userId: 1, otherData: 'some-data' }).then((data) => {
        expect(data).to.eql({ userId: 1, otherData: 'some-data' });
      });
    });
  });

  describe('#invalidate', function() {
    it('returns a resolving promise', function() {
      return authenticator.invalidate().then(() => {
        expect(true).to.be.true;
      });
    });
  });
});
