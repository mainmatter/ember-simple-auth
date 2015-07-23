/* jshint expr:true */
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import Test from 'ember-simple-auth/authenticators/test';

let authenticator;

describe('Authenticators.Test', () => {
  beforeEach(() => {
    authenticator = Test.create();
  });

  describe('#restore', () => {
    it('returns a resolving promise', () => {
      return authenticator.restore().then(() => {
        expect(true).to.be.true;
      });
    });
  });

  describe('#authenticate', () => {
    it('returns a resolving promise', () => {
      return authenticator.authenticate().then(() => {
        expect(true).to.be.true;
      });
    });

    it('resolves with session data', () => {
      return authenticator.authenticate({ userId: 1, otherData: 'some-data' }).then((data) => {
        expect(data).to.eql({ userId: 1, otherData: 'some-data' });
      });
    });
  });

  describe('#invalidate', () => {
    it('returns a resolving promise', () => {
      return authenticator.invalidate().then(() => {
        expect(true).to.be.true;
      });
    });
  });
});
