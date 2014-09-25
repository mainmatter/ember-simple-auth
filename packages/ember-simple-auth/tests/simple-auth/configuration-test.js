import Configuration from 'simple-auth/configuration';

describe('Configuration', function() {
  beforeEach(function() {
    window.ENV                = window.ENV || {};
    window.ENV['simple-auth'] = {};

    this.container     = { lookup: function() {} };
    this.router        = { get: function() { return 'rootURL'; } };
    this.containerStub = sinon.stub(this.container, 'lookup');
    this.containerStub.withArgs('router:main').returns(this.router);
  });

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

    it('sets authenticationRoute correctly', function() {
      window.ENV['simple-auth'].authenticationRoute = 'authenticationRoute';
      Configuration.load(this.container);

      expect(Configuration.authenticationRoute).to.eql('authenticationRoute');
    });

    it('sets routeAfterAuthentication correctly', function() {
      window.ENV['simple-auth'].routeAfterAuthentication = 'routeAfterAuthentication';
      Configuration.load(this.container);

      expect(Configuration.routeAfterAuthentication).to.eql('routeAfterAuthentication');
    });

    it('sets routeIfAlreadyAuthenticated correctly', function() {
      window.ENV['simple-auth'].routeIfAlreadyAuthenticated = 'routeIfAlreadyAuthenticated';
      Configuration.load(this.container);

      expect(Configuration.routeIfAlreadyAuthenticated).to.eql('routeIfAlreadyAuthenticated');
    });

    it('sets sessionPropertyName correctly', function() {
      window.ENV['simple-auth'].sessionPropertyName = 'sessionPropertyName';
      Configuration.load(this.container);

      expect(Configuration.sessionPropertyName).to.eql('sessionPropertyName');
    });

    it('sets authorizer correctly', function() {
      window.ENV['simple-auth'].authorizer = 'authorizer';
      Configuration.load(this.container);

      expect(Configuration.authorizer).to.eql('authorizer');
    });

    it('sets session correctly', function() {
      window.ENV['simple-auth'].session = 'session';
      Configuration.load(this.container);

      expect(Configuration.session).to.eql('session');
    });

    it('sets store correctly', function() {
      window.ENV['simple-auth'].store = 'store';
      Configuration.load(this.container);

      expect(Configuration.store).to.eql('store');
    });

    it('sets crossOriginWhitelist correctly', function() {
      window.ENV['simple-auth'].crossOriginWhitelist = ['https://some.origin:1234'];
      Configuration.load(this.container);

      expect(Configuration.crossOriginWhitelist).to.eql(['https://some.origin:1234']);
    });
  });

  afterEach(function() {
    delete window.ENV['simple-auth'];
    Configuration.load(this.container);
  });
});
