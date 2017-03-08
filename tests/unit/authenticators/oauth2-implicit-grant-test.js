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

  let accessTokenHash = '#access_token=secret-token&state=abcd&token_type=bearer';

  const accessToken = {
    'access_token': 'secret-token',
    'state': 'abcd',
    'token_type': 'bearer'
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
        return authenticator.restore(accessToken).then((_data) => {
          expect(_data).to.eql(accessToken);
        });
      });

      describe('when the data does not contain an access_token', function() {
        it('returns a rejecting promise', function() {
          return authenticator.restore().catch((_err) => {
            expect(_err).to.eql('the token could not be restored, invalid token: missing access_token, state, or token_type');
          });
        });
      });
    });
  });

  describe('#authenticate', function() {
    describe('with hash provided', function() {
      it('authentication should succeed on a proper access token', function() {
        return authenticator.authenticate(accessTokenHash).then((_accessToken) => {
          expect(_accessToken).to.eql(accessToken);
        });
      });

      it('authentication should fail on an invalid access token', function() {
        return authenticator.authenticate('#foo=bar').catch((_err) => {
          expect(_err).to.eql('invalid token: missing access_token, state, or token_type');
        });
      });

      it('authentication should fail on a proper error object', function() {
        return authenticator.authenticate('#error=access_denied').catch((_err) => {
          expect(_err).to.eql('access_denied');
        });
      });
    });
  });

  describe('#invalidate', function() {
    it('returns a resolving promise', function(done) {
      authenticator.invalidate().then(() => {
        done();
      });
    });
  });
});
