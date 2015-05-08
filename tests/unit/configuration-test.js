/* jshint expr:true */
import { it } from 'ember-mocha';
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

  describe('cookieDomain', function() {
    it('defaults to null', function() {
      expect(Configuration.cookieDomain).to.be.null;
    });
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
    it('defaults to "email"', function() {
      expect(Configuration.identificationAttributeName).to.eq('email');
    });
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

    it('sets cookieDomain correctly', function() {
      Configuration.load(this.container, { cookieDomain: '.example.com' });

      expect(Configuration.cookieDomain).to.eql('.example.com');
    });

    it('sets cookieName correctly', function() {
      Configuration.load(this.container, { cookieName: 'cookieName' });

      expect(Configuration.cookieName).to.eql('cookieName');
    });

    it('sets cookieExpirationTime correctly', function() {
      Configuration.load(this.container, { cookieExpirationTime: 1 });

      expect(Configuration.cookieExpirationTime).to.eql(1);
    });

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
