import Configuration from 'simple-auth-devise/configuration';

describe('Configuration', function() {
  beforeEach(function() {
    this.container = {};
  });

  describe('serverTokenEndpoint', function() {
    it('defaults to "/users/sign_in"', function() {
      expect(Configuration.serverTokenEndpoint).to.eql('/users/sign_in');
    });
  });

  describe('resourceName', function() {
    it('defaults to "user"', function() {
      expect(Configuration.resourceName).to.eq('user');
    });
  });

  describe('.load', function() {
    it('sets serverTokenEndpoint correctly', function() {
      Configuration.load(this.container, { serverTokenEndpoint: 'serverTokenEndpoint' });

      expect(Configuration.serverTokenEndpoint).to.eql('serverTokenEndpoint');
    });

    it('sets resourceName correctly', function() {
      Configuration.load(this.container, { resourceName: 'resourceName' });

      expect(Configuration.resourceName).to.eql('resourceName');
    });
  });

  afterEach(function() {
    Configuration.load(this.container, {});
  });
});
