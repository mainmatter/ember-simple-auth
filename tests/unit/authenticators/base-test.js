/* jshint expr:true */
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import Base from 'ember-simple-auth/authenticators/base';

describe('BaseAuthenticator', () => {
  let authenticator;

  beforeEach(() => {
    authenticator = Base.create();
  });

  describe('#restore', () => {
    it('returns a rejecting promise', (done) => {
      authenticator.restore().catch(() => {
        expect(true).to.be.true;
        done();
      });
    });
  });

  describe('#authenticate', () => {
    it('returns a rejecting promise', (done) => {
      authenticator.authenticate().catch(() => {
        expect(true).to.be.true;
        done();
      });
    });
  });

  describe('#invalidate', () => {
    it('returns a resolving promise', (done) => {
      authenticator.invalidate().then(() => {
        expect(true).to.be.true;
        done();
      });
    });
  });
});
