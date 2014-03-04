import { Base } from 'ember-simple-auth/authenticators/base';

describe('Authenticators.Base', function() {
  beforeEach(function() {
    this.authenticator = Base.create();
  });

  describe('#restore', function() {
    it('returns a rejecting promise', function(done) {
      this.authenticator.restore().then(function() {
        expect().fail();
        done();
      }, function() {
        expect(true).to.be.ok();
        done();
      });
    });
  });

  describe('#authenticate', function() {
    it('returns a rejecting promise', function(done) {
      this.authenticator.authenticate().then(function() {
        expect().fail();
        done();
      }, function() {
        expect(true).to.be.ok();
        done();
      });
    });
  });

  describe('#invalidate', function() {
    it('returns a rejecting promise', function(done) {
      this.authenticator.invalidate().then(function() {
        expect().fail();
        done();
      }, function() {
        expect(true).to.be.ok();
        done();
      });
    });
  });
});
