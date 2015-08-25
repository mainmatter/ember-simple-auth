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

  describe('localStorage.key', () => {
    it('defaults to "ember_simple_auth:session"', () => {
      expect(Configuration.localStorage.key).to.eql('ember_simple_auth:session');
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

    it('sets localStorage.key correctly', () => {
      Configuration.load({ localStorage: { key: 'localStorageKey' } });

      expect(Configuration.localStorage.key).to.eql('localStorageKey');
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
  });
});
