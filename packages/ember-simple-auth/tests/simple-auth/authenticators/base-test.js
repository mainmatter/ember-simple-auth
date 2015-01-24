import Base from 'simple-auth/authenticators/base';

describe('Authenticators.Base', function() {
  beforeEach(function() {
    this.authenticator = Base.create();
  });

  describe('#restore', function() {
    it('returns a rejecting promise', function(done) {
      this.authenticator.restore().then(null, function() {
        expect(true).to.be.true;
        done();
      });
    });

    it('rejects with the passed data', function(done) {
      this.authenticator.restore({ some: 'property' }).then(null, function() {
        expect(true).to.be.true;
        done({ some: 'property' });
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
    it('returns a resolving promise', function(done) {
      this.authenticator.invalidate().then(function() {
        expect(true).to.be.true;
        done();
      });
    });
  });
});
