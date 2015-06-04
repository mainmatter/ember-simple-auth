/* jshint expr:true */
import { it } from 'ember-mocha';
import Configuration from 'ember-simple-auth/configuration';

describe('Configuration', function() {
  beforeEach(function() {
    this.container     = { lookup: function() {} };
    this.router        = { get: function() { return 'rootURL'; } };
    this.containerStub = sinon.stub(this.container, 'lookup');
    this.containerStub.withArgs('router:main').returns(this.router);
  });

  describe('authenticationRoute', function() {
    it('defaults to "login"', function() {
      expect(Configuration.base.authenticationRoute).to.eql('login');
    });
  });

  describe('routeAfterAuthentication', function() {
    it('defaults to "index"', function() {
      expect(Configuration.base.routeAfterAuthentication).to.eql('index');
    });
  });

  describe('routeIfAlreadyAuthenticated', function() {
    it('defaults to "index"', function() {
      expect(Configuration.base.routeIfAlreadyAuthenticated).to.eql('index');
    });
  });

  describe('sessionPropertyName', function() {
    it('defaults to "session"', function() {
      expect(Configuration.base.sessionPropertyName).to.eql('session');
    });
  });

  describe('authorizer', function() {
    it('defaults to null', function() {
      expect(Configuration.base.authorizer).to.be.null;
    });
  });

  describe('session', function() {
    it('defaults to "simple-auth-session:main"', function() {
      expect(Configuration.base.session).to.eq('simple-auth-session:main');
    });
  });

  describe('store', function() {
    it('defaults to "simple-auth-session-store:local-storage"', function() {
      expect(Configuration.base.store).to.eq('simple-auth-session-store:local-storage');
    });
  });

  describe('localStorageKey', function() {
    it('defaults to "ember_simple_auth:session"', function() {
      expect(Configuration.base.localStorageKey).to.eql('ember_simple_auth:session');
    });
  });

  describe('crossOriginWhitelist', function() {
    it('defaults to []', function() {
      expect(Configuration.base.crossOriginWhitelist).to.be.a('array');
      expect(Configuration.base.crossOriginWhitelist).to.be.empty;
    });
  });

  describe('cookie.domain', function() {
    it('defaults to null', function() {
      expect(Configuration.cookie.domain).to.be.null;
    });
  });

  describe('cookie.name', function() {
    it('defaults to "ember_simple_auth:session"', function() {
      expect(Configuration.cookie.name).to.eql('ember_simple_auth:session');
    });
  });

  describe('cookie.expirationTime', function() {
    it('defaults to null', function() {
      expect(Configuration.cookie.expirationTime).to.be.null;
    });
  });

  describe('serverTokenEndpoint', function() {
    it('defaults to "/users/sign_in"', function() {
      expect(Configuration.devise.serverTokenEndpoint).to.eql('/users/sign_in');
    });
  });

  describe('resourceName', function() {
    it('defaults to "user"', function() {
      expect(Configuration.devise.resourceName).to.eq('user');
    });
  });

  describe('tokenAttributeName', function() {
    it('defaults to "token"', function() {
      expect(Configuration.devise.tokenAttributeName).to.eql('token');
    });
  });

  describe('identificationAttributeName', function() {
    it('defaults to "email"', function() {
      expect(Configuration.devise.identificationAttributeName).to.eq('email');
    });
  });

  describe('serverTokenEndpoint', function() {
    it('defaults to "/token"', function() {
      expect(Configuration.oauth2.serverTokenEndpoint).to.eql('/token');
    });
  });

  describe('serverTokenRevocationEndpoint', function() {
    it('defaults to null', function() {
      expect(Configuration.oauth2.serverTokenRevocationEndpoint).to.be.null;
    });
  });

  describe('refreshAccessTokens', function() {
    it('defaults to true', function() {
      expect(Configuration.oauth2.refreshAccessTokens).to.be.true;
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

      expect(Configuration.base.applicationRootUrl).to.eql('rootURL');
    });

    it('sets authenticationRoute correctly', function() {
      Configuration.load(this.container, { base: { authenticationRoute: 'authenticationRoute' } });

      expect(Configuration.base.authenticationRoute).to.eql('authenticationRoute');
    });

    it('sets routeAfterAuthentication correctly', function() {
      Configuration.load(this.container, { base: { routeAfterAuthentication: 'routeAfterAuthentication' } });

      expect(Configuration.base.routeAfterAuthentication).to.eql('routeAfterAuthentication');
    });

    it('sets routeIfAlreadyAuthenticated correctly', function() {
      Configuration.load(this.container, { base: { routeIfAlreadyAuthenticated: 'routeIfAlreadyAuthenticated' } });

      expect(Configuration.base.routeIfAlreadyAuthenticated).to.eql('routeIfAlreadyAuthenticated');
    });

    it('sets sessionPropertyName correctly', function() {
      Configuration.load(this.container, { base: { sessionPropertyName: 'sessionPropertyName' } });

      expect(Configuration.base.sessionPropertyName).to.eql('sessionPropertyName');
    });

    it('sets authorizer correctly', function() {
      Configuration.load(this.container, { base: { authorizer: 'authorizer' } });

      expect(Configuration.base.authorizer).to.eql('authorizer');
    });

    it('sets session correctly', function() {
      Configuration.load(this.container, { base: { session: 'session' } });

      expect(Configuration.base.session).to.eql('session');
    });

    it('sets store correctly', function() {
      Configuration.load(this.container, { base: { store: 'store' } });

      expect(Configuration.base.store).to.eql('store');
    });

    it('sets localStorageKey correctly', function() {
      Configuration.load(this.container, { base: { localStorageKey: 'localStorageKey' } });

      expect(Configuration.base.localStorageKey).to.eql('localStorageKey');
    });

    it('sets crossOriginWhitelist correctly', function() {
      Configuration.load(this.container, { base: { crossOriginWhitelist: ['https://some.origin:1234'] } });

      expect(Configuration.base.crossOriginWhitelist).to.eql(['https://some.origin:1234']);
    });

    it('sets cookieDomain correctly', function() {
      Configuration.load(this.container, { cookie: { domain: '.example.com' } });

      expect(Configuration.cookie.domain).to.eql('.example.com');
    });

    it('sets cookieName correctly', function() {
      Configuration.load(this.container, { cookie: { name: 'cookieName' } });

      expect(Configuration.cookie.name).to.eql('cookieName');
    });

    it('sets cookieExpirationTime correctly', function() {
      Configuration.load(this.container, { cookie: { expirationTime: 1 } });

      expect(Configuration.cookie.expirationTime).to.eql(1);
    });

    it('sets serverTokenEndpoint correctly', function() {
      Configuration.load(this.container, { devise: { serverTokenEndpoint: 'serverTokenEndpoint' } });

      expect(Configuration.devise.serverTokenEndpoint).to.eql('serverTokenEndpoint');
    });

    it('sets resourceName correctly', function() {
      Configuration.load(this.container, { devise: { resourceName: 'resourceName' } });

      expect(Configuration.devise.resourceName).to.eql('resourceName');
    });

    it('sets identificationAttributeName correctly', function() {
      Configuration.load(this.container, { devise: { identificationAttributeName: 'identificationAttributeName' } });

      expect(Configuration.devise.identificationAttributeName).to.eql('identificationAttributeName');
    });

    it('sets tokenAttributeName correctly', function() {
      Configuration.load(this.container, { devise: { tokenAttributeName: 'tokenAttributeName' } });

      expect(Configuration.devise.tokenAttributeName).to.eql('tokenAttributeName');
    });

    it('sets serverTokenEndpoint correctly', function() {
      Configuration.load(this.container, { oauth2: { serverTokenEndpoint: 'serverTokenEndpoint' } });

      expect(Configuration.oauth2.serverTokenEndpoint).to.eql('serverTokenEndpoint');
    });

    it('sets serverTokenRevocationEndpoint correctly', function() {
      Configuration.load(this.container, { oauth2: { serverTokenRevocationEndpoint: 'serverTokenRevocationEndpoint' } });

      expect(Configuration.oauth2.serverTokenRevocationEndpoint).to.eql('serverTokenRevocationEndpoint');
    });

    it('sets refreshAccessTokens correctly', function() {
      Configuration.load(this.container, { oauth2: { refreshAccessTokens: false } });

      expect(Configuration.oauth2.refreshAccessTokens).to.be.false;
    });
  });

  afterEach(function() {
    Configuration.load(this.container, {});
  });
});
