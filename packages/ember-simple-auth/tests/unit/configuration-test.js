import { describe, afterEach, it } from 'mocha';
import { expect } from 'chai';
import Configuration from 'ember-simple-auth/configuration';

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

  describe('.load', function() {
    it('sets rootURL correctly', function() {
      Configuration.load({ rootURL: '/rootURL' });

      expect(Configuration.rootURL).to.eql('/rootURL');
    });
  });
});
