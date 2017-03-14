/* jshint expr:true */
/* jscs:disable requireDotNotation */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import Pretender from 'pretender';
import OAuth2ImplicitGrant from 'ember-simple-auth/authenticators/oauth2-implicit-grant';

const { tryInvoke } = Ember;

describe('OAuth2ImplicitGrantAuthenticator', () => {
  let authenticator;
  let server;

  let data = {
    'access_token': 'secret-token'
  };

  beforeEach(function() {
    authenticator = OAuth2ImplicitGrant.create();
    server = new Pretender();
  });

  afterEach(function() {
    tryInvoke(server, 'shutdown');
  });

  describe('#restore', function() {
    describe('when the data contains an access_token', function() {
      it('resolves with the correct data', function() {
        return authenticator.restore(data).then((_data) => {
          expect(_data).to.eql(data);
        });
      });

      describe('when the data does not contain an access_token', function() {
        it('returns a rejecting promise', function() {
          return authenticator.restore().catch((_err) => {
            expect(_err).to.eql('Could not restore session - "access_token" missing.');
          });
        });
      });
    });
  });

  describe('#authenticate', function() {
    describe('when the data contains an access_token', function() {
      it('resolves with the correct data', function() {
        return authenticator.authenticate(data).then((_data) => {
          expect(_data).to.eql(data);
        });
      });
    });

    describe('when the data does not contain an access_token', function() {
      it('rejects with an error', function() {
        return authenticator.authenticate({ foo: 'bar' }).catch((_err) => {
          expect(_err).to.eql('Invalid auth params - "access_token" missing.');
        });
      });
    });

    describe('when the data contains an error', function() {
      it('rejects with that error', function() {
        return authenticator.authenticate({ error: 'access_denied' }).catch((_err) => {
          expect(_err).to.eql('access_denied');
        });
      });
    });
  });

  describe('#invalidate', function() {
    it('returns a resolving promise', function() {
      return authenticator.invalidate().then(() => {
        expect(true).to.be.true;
      });
    });
  });
});
