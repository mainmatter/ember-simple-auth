import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import Base from 'ember-simple-auth/authenticators/base';

describe('BaseAuthenticator', () => {
  let authenticator;

  beforeEach(function() {
    authenticator = Base.create();
  });

  describe('#restore', function() {
    it('returns a rejecting promise', function(done) {
      authenticator.restore().catch(() => {
        expect(true).to.be.true;
        done();
      });
    });
  });

  describe('#authenticate', function() {
    it('returns a rejecting promise', function(done) {
      authenticator.authenticate().catch(() => {
        expect(true).to.be.true;
        done();
      });
    });
  });

  describe('#invalidate', function() {
    it('returns a resolving promise', function(done) {
      authenticator.invalidate().then(() => {
        expect(true).to.be.true;
        done();
      });
    });
  });
});
