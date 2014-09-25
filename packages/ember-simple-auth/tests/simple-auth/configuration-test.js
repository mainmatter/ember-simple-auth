import Configuration from 'simple-auth/configuration';

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

  describe('routeIfAlreadyAuthenticated', function() {
    it('defaults to "index"', function() {
      expect(Configuration.routeIfAlreadyAuthenticated).to.eql('index');
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

  describe('authorizer', function() {
    it('defaults to null', function() {
      expect(Configuration.authorizer).to.be.null;
    });
  });

  describe('session', function() {
    it('defaults to "simple-auth-session:main"', function() {
      expect(Configuration.session).to.eq('simple-auth-session:main');
    });
  });

  describe('store', function() {
    it('defaults to "simple-auth-session-store:local-storage"', function() {
      expect(Configuration.store).to.eq('simple-auth-session-store:local-storage');
    });
  });

  describe('crossOriginWhitelist', function() {
    it('defaults to []', function() {
      expect(Configuration.crossOriginWhitelist).to.be.a('array');
      expect(Configuration.crossOriginWhitelist).to.be.empty;
    });
  });

  describe('.load', function() {
    beforeEach(function() {
      this.container   = { lookup: function() {} };
      this.router      = { get: function() { return 'rootURL'; } };
      this.containerStub = sinon.stub(this.container, 'lookup');
      this.containerStub.withArgs('router:main').returns(this.router);
    });

    it("sets applicationRootUrl to the application's root URL", function() {
      Configuration.load(this.container);

      expect(Configuration.applicationRootUrl).to.eql('rootURL');
    });
  });
});
