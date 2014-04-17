import { isSecureUrl } from 'ember-simple-auth/utils/is_secure_url';

describe('Util', function() {
  describe('#isSecureUrl', function() {
    it('is true for "https://example.com"', function() {
      expect(isSecureUrl("https://example.com")).to.be.true;
    });

    it('is false for "http://example.com"', function() {
      expect(isSecureUrl("http://example.com")).to.be.false;
    });
  });
});
