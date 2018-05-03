import { describe, afterEach, it } from 'mocha';
import { expect } from 'chai';
import Configuration from 'ember-simple-auth/configuration';
import { registerDeprecationHandler } from '@ember/debug';

describe('Configuration', () => {
  afterEach(function() {
    Configuration.load({});
  });

  describe('rootURL', function() {
    it('defaults to ""', function() {
      Configuration.load({});

      expect(Configuration.rootURL).to.eql('');
    });
  });

  describe('baseURL', function() {
    it('is an alias to rootURL', function() {
      Configuration.load({ rootURL: '/rootURL' });

      expect(Configuration.baseURL).to.eql('/rootURL');
    });

    it('is deprecated', function() {
      let warnings;
      registerDeprecationHandler((message, options, next) => {
        // in case a deprecation is issued before a test is started
        if (!warnings) {
          warnings = [];
        }

        warnings.push(message);
        next(message, options);
      });
      Configuration.baseURL;

      expect(warnings[0]).to.eq('The baseURL property should no longer be used. Instead, use rootURL.');
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
    it('sets rootURL correctly', function() {
      Configuration.load({ rootURL: '/rootURL' });

      expect(Configuration.rootURL).to.eql('/rootURL');
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
