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

  describe('store', () => {
    it('defaults to "session-store:local-storage"', () => {
      expect(Configuration.store).to.eql('session-store:local-storage');
    });
  });

  describe('.load', () => {
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

    it('sets store correctly', () => {
      Configuration.load({ store: 'session-store:application' });

      expect(Configuration.store).to.eql('session-store:application');
    });
  });
});
