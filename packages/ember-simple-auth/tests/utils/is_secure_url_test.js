import { isSecureUrl } from 'ember-simple-auth/utils/is_secure_url';

describe('Util', function() {
  describe('#isSecureUrl', function() {
    it('expect "https://example.com" to be true', function(done) {
      expect(isSecureUrl("https://example.com")).to.be.true;
      done();
    });
    it('expect "http://example.com" to be false', function(done) {
      expect(isSecureUrl("http://example.com")).to.be.false;
      done();
    });
  });
});
