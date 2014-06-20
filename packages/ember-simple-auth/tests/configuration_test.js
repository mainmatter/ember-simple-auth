import Configuration from 'ember-simple-auth/configuration';

describe('Configuration', function() {
  describe('authenticationRoute', function() {
    it('defaults to "login"', function() {
      expect(Configuration.authenticationRoute).to.eql('login');
    });
  });

  describe('routeAfterAuthentication', function() {
    it('defaults to "index"', function() {
      expect(Configuration.routeAfterAuthentication).to.eql('index');
    });
  });

  describe('sessionPropertyName', function() {
    it('defaults to "session"', function() {
      expect(Configuration.sessionPropertyName).to.eql('session');
    });
  });

  describe('applicationRootUrl', function() {
    it('defaults to null', function() {
      expect(Configuration.applicationRootUrl).to.be.null;
    });
  });

  describe('authorizerFactory', function() {
    it('defaults to null', function() {
      expect(Configuration.authorizerFactory).to.be.null;
    });
  });

  describe('storeFactory', function() {
    it('defaults to "ember-simple-auth-session-store:local-storage"', function() {
      expect(Configuration.storeFactory).to.eq('ember-simple-auth-session-store:local-storage');
    });
  });

  describe('crossOriginWhitelist', function() {
    it('defaults to []', function() {
      expect(Configuration.crossOriginWhitelist).to.be.a('array');
      expect(Configuration.crossOriginWhitelist).to.be.empty;
    });
  });
});
