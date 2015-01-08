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

  describe('tokenAttributeName', function() {
    it('defaults to "token"', function() {
      expect(Configuration.tokenAttributeName).to.eql('token');
    });
  });

  describe('identificationAttributeName', function() {
    it('defaults to "user_email"', function() {
      expect(Configuration.identificationAttributeName).to.eq('user_email');
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

    it('sets identificationAttributeName correctly', function() {
      Configuration.load(this.container, { identificationAttributeName: 'identificationAttributeName' });

      expect(Configuration.identificationAttributeName).to.eql('identificationAttributeName');
    });

    it('sets tokenAttributeName correctly', function() {
      Configuration.load(this.container, { tokenAttributeName: 'tokenAttributeName' });

      expect(Configuration.tokenAttributeName).to.eql('tokenAttributeName');
    });
  });

  afterEach(function() {
    Configuration.load(this.container, {});
  });
});
