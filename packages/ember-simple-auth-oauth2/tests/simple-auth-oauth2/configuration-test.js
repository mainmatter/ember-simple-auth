import Configuration from 'simple-auth-oauth2/configuration';

describe('Configuration', function() {
  beforeEach(function() {
    this.container = {};
  });

  describe('serverTokenEndpoint', function() {
    it('defaults to "/token"', function() {
      expect(Configuration.serverTokenEndpoint).to.eql('/token');
    });
  });

  describe('serverTokenRevocationEndpoint', function() {
    it('defaults to null', function() {
      expect(Configuration.serverTokenRevocationEndpoint).to.be.null;
    });
  });

  describe('refreshAccessTokens', function() {
    it('defaults to true', function() {
      expect(Configuration.refreshAccessTokens).to.be.true;
    });
  });

  describe('.load', function() {
    it('sets serverTokenEndpoint correctly', function() {
      Configuration.load(this.container, { serverTokenEndpoint: 'serverTokenEndpoint' });

      expect(Configuration.serverTokenEndpoint).to.eql('serverTokenEndpoint');
    });

    it('sets serverTokenRevocationEndpoint correctly', function() {
      Configuration.load(this.container, { serverTokenRevocationEndpoint: 'serverTokenRevocationEndpoint' });

      expect(Configuration.serverTokenRevocationEndpoint).to.eql('serverTokenRevocationEndpoint');
    });

    it('sets refreshAccessTokens correctly', function() {
      Configuration.load(this.container, { refreshAccessTokens: false });

      expect(Configuration.refreshAccessTokens).to.be.false;
    });
  });

  afterEach(function() {
    Configuration.load(this.container, {});
  });
});
