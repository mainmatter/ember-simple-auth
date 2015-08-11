/* jshint expr:true */
import { it } from 'ember-mocha';
import { describe, afterEach } from 'mocha';
import { expect } from 'chai';
import Configuration from 'ember-simple-auth/configuration';

describe('Configuration', () => {
  afterEach(() => {
    Configuration.load({});
  });

  describe('authenticationRoute', () => {
    it('defaults to "login"', () => {
      expect(Configuration.base.authenticationRoute).to.eql('login');
    });
  });

  describe('routeAfterAuthentication', () => {
    it('defaults to "index"', () => {
      expect(Configuration.base.routeAfterAuthentication).to.eql('index');
    });
  });

  describe('routeIfAlreadyAuthenticated', () => {
    it('defaults to "index"', () => {
      expect(Configuration.base.routeIfAlreadyAuthenticated).to.eql('index');
    });
  });

  describe('authorizer', () => {
    it('defaults to null', () => {
      expect(Configuration.base.authorizer).to.be.null;
    });
  });

  describe('localStorageKey', () => {
    it('defaults to "ember_simple_auth:session"', () => {
      expect(Configuration.base.localStorageKey).to.eql('ember_simple_auth:session');
    });
  });

  describe('crossOriginWhitelist', () => {
    it('defaults to []', () => {
      expect(Configuration.base.crossOriginWhitelist).to.be.a('array');
      expect(Configuration.base.crossOriginWhitelist).to.be.empty;
    });
  });

  describe('cookie.domain', () => {
    it('defaults to null', () => {
      expect(Configuration.cookie.domain).to.be.null;
    });
  });

  describe('cookie.name', () => {
    it('defaults to "ember_simple_auth:session"', () => {
      expect(Configuration.cookie.name).to.eql('ember_simple_auth:session');
    });
  });

  describe('cookie.expirationTime', () => {
    it('defaults to null', () => {
      expect(Configuration.cookie.expirationTime).to.be.null;
    });
  });

  describe('serverTokenEndpoint', () => {
    it('defaults to "/users/sign_in"', () => {
      expect(Configuration.devise.serverTokenEndpoint).to.eql('/users/sign_in');
    });
  });

  describe('resourceName', () => {
    it('defaults to "user"', () => {
      expect(Configuration.devise.resourceName).to.eq('user');
    });
  });

  describe('tokenAttributeName', () => {
    it('defaults to "token"', () => {
      expect(Configuration.devise.tokenAttributeName).to.eql('token');
    });
  });

  describe('identificationAttributeName', () => {
    it('defaults to "email"', () => {
      expect(Configuration.devise.identificationAttributeName).to.eq('email');
    });
  });

  describe('serverTokenEndpoint', () => {
    it('defaults to "/token"', () => {
      expect(Configuration.oauth2.serverTokenEndpoint).to.eql('/token');
    });
  });

  describe('serverTokenRevocationEndpoint', () => {
    it('defaults to null', () => {
      expect(Configuration.oauth2.serverTokenRevocationEndpoint).to.be.null;
    });
  });

  describe('refreshAccessTokens', () => {
    it('defaults to true', () => {
      expect(Configuration.oauth2.refreshAccessTokens).to.be.true;
    });
  });

  describe('.load', () => {
    it('sets authenticationRoute correctly', () => {
      Configuration.load({ base: { authenticationRoute: 'authenticationRoute' } });

      expect(Configuration.base.authenticationRoute).to.eql('authenticationRoute');
    });

    it('sets routeAfterAuthentication correctly', () => {
      Configuration.load({ base: { routeAfterAuthentication: 'routeAfterAuthentication' } });

      expect(Configuration.base.routeAfterAuthentication).to.eql('routeAfterAuthentication');
    });

    it('sets routeIfAlreadyAuthenticated correctly', () => {
      Configuration.load({ base: { routeIfAlreadyAuthenticated: 'routeIfAlreadyAuthenticated' } });

      expect(Configuration.base.routeIfAlreadyAuthenticated).to.eql('routeIfAlreadyAuthenticated');
    });

    it('sets authorizer correctly', () => {
      Configuration.load({ base: { authorizer: 'authorizer' } });

      expect(Configuration.base.authorizer).to.eql('authorizer');
    });

    it('sets localStorageKey correctly', () => {
      Configuration.load({ base: { localStorageKey: 'localStorageKey' } });

      expect(Configuration.base.localStorageKey).to.eql('localStorageKey');
    });

    it('sets crossOriginWhitelist correctly', () => {
      Configuration.load({ base: { crossOriginWhitelist: ['https://some.origin:1234'] } });

      expect(Configuration.base.crossOriginWhitelist).to.eql(['https://some.origin:1234']);
    });

    it('sets cookieDomain correctly', () => {
      Configuration.load({ cookie: { domain: '.example.com' } });

      expect(Configuration.cookie.domain).to.eql('.example.com');
    });

    it('sets cookieName correctly', () => {
      Configuration.load({ cookie: { name: 'cookieName' } });

      expect(Configuration.cookie.name).to.eql('cookieName');
    });

    it('sets cookieExpirationTime correctly', () => {
      Configuration.load({ cookie: { expirationTime: 1 } });

      expect(Configuration.cookie.expirationTime).to.eql(1);
    });

    it('sets serverTokenEndpoint correctly', () => {
      Configuration.load({ devise: { serverTokenEndpoint: 'serverTokenEndpoint' } });

      expect(Configuration.devise.serverTokenEndpoint).to.eql('serverTokenEndpoint');
    });

    it('sets resourceName correctly', () => {
      Configuration.load({ devise: { resourceName: 'resourceName' } });

      expect(Configuration.devise.resourceName).to.eql('resourceName');
    });

    it('sets identificationAttributeName correctly', () => {
      Configuration.load({ devise: { identificationAttributeName: 'identificationAttributeName' } });

      expect(Configuration.devise.identificationAttributeName).to.eql('identificationAttributeName');
    });

    it('sets tokenAttributeName correctly', () => {
      Configuration.load({ devise: { tokenAttributeName: 'tokenAttributeName' } });

      expect(Configuration.devise.tokenAttributeName).to.eql('tokenAttributeName');
    });

    it('sets clientId correctly', () => {
      Configuration.load({ oauth2: { clientId: 'clientId' } });

      expect(Configuration.oauth2.clientId).to.eql('clientId');
    });

    it('sets serverTokenEndpoint correctly', () => {
      Configuration.load({ oauth2: { serverTokenEndpoint: 'serverTokenEndpoint' } });

      expect(Configuration.oauth2.serverTokenEndpoint).to.eql('serverTokenEndpoint');
    });

    it('sets serverTokenRevocationEndpoint correctly', () => {
      Configuration.load({ oauth2: { serverTokenRevocationEndpoint: 'serverTokenRevocationEndpoint' } });

      expect(Configuration.oauth2.serverTokenRevocationEndpoint).to.eql('serverTokenRevocationEndpoint');
    });

    it('sets refreshAccessTokens correctly', () => {
      Configuration.load({ oauth2: { refreshAccessTokens: false } });

      expect(Configuration.oauth2.refreshAccessTokens).to.be.false;
    });
  });
});
