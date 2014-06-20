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
});
