/* jshint expr:true */
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import Test from 'ember-simple-auth/authenticators/test';

describe('Authenticators.Test', function() {
  beforeEach(function() {
    this.authenticator = Test.create();
  });

  describe('#restore', function() {
    it('returns a resolving promise', function(done) {
      this.authenticator.restore().then(function() {
        expect(true).to.be.true;
        done();
      });
    });
  });

  describe('#authenticate', function() {
    it('returns a resolving promise', function(done) {
      this.authenticator.authenticate().then(function() {
        expect(true).to.be.true;
        done();
      });
    });

    it('resolves with session data', function() {
      return this.authenticator.authenticate({ userId: 1, otherData: 'some-data' }).then(function(data) {
        expect(data).to.eql({ userId: 1, otherData: 'some-data' });
      });
    });
  });

  describe('#invalidate', function() {
    it('returns a resolving promise', function(done) {
      this.authenticator.invalidate().then(function() {
        expect(true).to.be.true;
        done();
      });
    });
  });
});
