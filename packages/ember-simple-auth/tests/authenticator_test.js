import { Authenticator } from 'ember-simple-auth/authenticator';

describe('Authenticator', function() {
  beforeEach(function() {
    this.authenticator = Authenticator.create();
  });

  describe('#restore', function() {
    it('returns a rejecting promise', function(done) {
      this.authenticator.restore().then(null, function() {
        expect(true).to.be.true;
        done();
      });
    });
  });

  describe('#authenticate', function() {
    it('returns a rejecting promise', function(done) {
      this.authenticator.authenticate().then(null, function() {
        expect(true).to.be.true;
        done();
      });
    });
  });

  describe('#invalidate', function() {
    it('returns a rejecting promise', function(done) {
      this.authenticator.invalidate().then(function() {
        expect(true).to.be.true;
        done();
      });
    });
  });
});
