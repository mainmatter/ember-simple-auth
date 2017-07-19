import { describe, afterEach, it } from 'mocha';
import { expect } from 'chai';
import Configuration from 'ember-simple-auth/configuration';

describe('Configuration', () => {
  afterEach(function() {
    Configuration.load({});
  });

  describe('baseURL', function() {
    it('defaults to ""', function() {
      Configuration.load({});

      expect(Configuration.baseURL).to.eql('');
    });
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

  describe('.load', function() {
    it('sets baseURL correctly', function() {
      Configuration.load({ baseURL: '/baseURL' });

      expect(Configuration.baseURL).to.eql('/baseURL');
    });

    it('sets authenticationRoute correctly', function() {
      Configuration.load({ authenticationRoute: 'authenticationRoute' });

      expect(Configuration.authenticationRoute).to.eql('authenticationRoute');
    });

    it('sets routeAfterAuthentication correctly', function() {
      Configuration.load({ routeAfterAuthentication: 'routeAfterAuthentication' });

      expect(Configuration.routeAfterAuthentication).to.eql('routeAfterAuthentication');
    });

    it('sets routeIfAlreadyAuthenticated correctly', function() {
      Configuration.load({ routeIfAlreadyAuthenticated: 'routeIfAlreadyAuthenticated' });

      expect(Configuration.routeIfAlreadyAuthenticated).to.eql('routeIfAlreadyAuthenticated');
    });
  });
});
