import Configuration from 'simple-auth/configuration';

describe('Configuration', function() {
  beforeEach(function() {
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

  describe('localStorageKey', function() {
    it('defaults to "ember_simple_auth:session"', function() {
      expect(Configuration.localStorageKey).to.eql('ember_simple_auth:session');
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
      Configuration.load(this.container, {});

      expect(Configuration.applicationRootUrl).to.eql('rootURL');
    });

    it('sets authenticationRoute correctly', function() {
      Configuration.load(this.container, { authenticationRoute: 'authenticationRoute' });

      expect(Configuration.authenticationRoute).to.eql('authenticationRoute');
    });

    it('sets routeAfterAuthentication correctly', function() {
      Configuration.load(this.container, { routeAfterAuthentication: 'routeAfterAuthentication' });

      expect(Configuration.routeAfterAuthentication).to.eql('routeAfterAuthentication');
    });

    it('sets routeIfAlreadyAuthenticated correctly', function() {
      Configuration.load(this.container, { routeIfAlreadyAuthenticated: 'routeIfAlreadyAuthenticated' });

      expect(Configuration.routeIfAlreadyAuthenticated).to.eql('routeIfAlreadyAuthenticated');
    });

    it('sets sessionPropertyName correctly', function() {
      Configuration.load(this.container, { sessionPropertyName: 'sessionPropertyName' });

      expect(Configuration.sessionPropertyName).to.eql('sessionPropertyName');
    });

    it('sets authorizer correctly', function() {
      Configuration.load(this.container, { authorizer: 'authorizer' });

      expect(Configuration.authorizer).to.eql('authorizer');
    });

    it('sets session correctly', function() {
      Configuration.load(this.container, { session: 'session' });

      expect(Configuration.session).to.eql('session');
    });

    it('sets store correctly', function() {
      Configuration.load(this.container, { store: 'store' });

      expect(Configuration.store).to.eql('store');
    });

    it('sets localStorageKey correctly', function() {
      Configuration.load(this.container, { localStorageKey: 'localStorageKey' });

      expect(Configuration.localStorageKey).to.eql('localStorageKey');
    });

    it('sets crossOriginWhitelist correctly', function() {
      Configuration.load(this.container, { crossOriginWhitelist: ['https://some.origin:1234'] });

      expect(Configuration.crossOriginWhitelist).to.eql(['https://some.origin:1234']);
    });
  });

  afterEach(function() {
    Configuration.load(this.container, {});
  });
});
