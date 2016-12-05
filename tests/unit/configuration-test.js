/* jshint expr:true */
import { describe, afterEach, it } from 'mocha';
import { expect } from 'chai';
import Configuration from 'ember-simple-auth/configuration';

describe('Configuration', () => {
  afterEach(() => {
    Configuration.load({});
  });

  describe('baseURL', () => {
    it('defaults to ""', () => {
      Configuration.load({});

      expect(Configuration.baseURL).to.eql('');
    });
  });

  describe('authenticationRoute', () => {
    it('defaults to "login"', () => {
      expect(Configuration.authenticationRoute).to.eql('login');
    });
  });

  describe('routeAfterAuthentication', () => {
    it('defaults to "index"', () => {
      expect(Configuration.routeAfterAuthentication).to.eql('index');
    });
  });

  describe('routeIfAlreadyAuthenticated', () => {
    it('defaults to "index"', () => {
      expect(Configuration.routeIfAlreadyAuthenticated).to.eql('index');
    });
  });

  describe('.load', () => {
    it('sets baseURL correctly', () => {
      Configuration.load({ baseURL: '/baseURL' });

      expect(Configuration.baseURL).to.eql('/baseURL');
    });

    it('sets authenticationRoute correctly', () => {
      Configuration.load({ authenticationRoute: 'authenticationRoute' });

      expect(Configuration.authenticationRoute).to.eql('authenticationRoute');
    });

    it('sets routeAfterAuthentication correctly', () => {
      Configuration.load({ routeAfterAuthentication: 'routeAfterAuthentication' });

      expect(Configuration.routeAfterAuthentication).to.eql('routeAfterAuthentication');
    });

    it('sets routeIfAlreadyAuthenticated correctly', () => {
      Configuration.load({ routeIfAlreadyAuthenticated: 'routeIfAlreadyAuthenticated' });

      expect(Configuration.routeIfAlreadyAuthenticated).to.eql('routeIfAlreadyAuthenticated');
    });
  });
});
