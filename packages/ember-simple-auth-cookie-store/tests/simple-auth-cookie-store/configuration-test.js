import Configuration from 'simple-auth-cookie-store/configuration';

describe('Configuration', function() {
  beforeEach(function() {
    this.container = {};
  });

  describe('cookieName', function() {
    it('defaults to "ember_simple_auth:session"', function() {
      expect(Configuration.cookieName).to.eql('ember_simple_auth:session');
    });
  });

  describe('cookieExpirationTime', function() {
    it('defaults to null', function() {
      expect(Configuration.cookieExpirationTime).to.be.null;
    });
  });

  describe('.load', function() {
    it('sets cookieName correctly', function() {
      Configuration.load(this.container, { cookieName: 'cookieName' });

      expect(Configuration.cookieName).to.eql('cookieName');
    });

    it('sets cookieExpirationTime correctly', function() {
      Configuration.load(this.container, { cookieExpirationTime: 1 });

      expect(Configuration.cookieExpirationTime).to.eql(1);
    });
  });

  afterEach(function() {
    Configuration.load(this.container, {});
  });
});
