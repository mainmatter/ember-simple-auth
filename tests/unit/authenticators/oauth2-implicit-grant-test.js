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

  beforeEach(() => {
    authenticator = OAuth2ImplicitGrant.create();
    server        = new Pretender();
  });

  afterEach(() => {
    tryInvoke(server, 'shutdown');
  });

  describe('#restore', () => {
    describe('when the data contains an access_token', () => {
      it('resolves with the correct data', () => {
        return authenticator.restore(accessToken).then((_data) => {
          expect(_data).to.eql(accessToken);
        });
      });

      describe('when the data does not contain an access_token', () => {
        it('returns a rejecting promise', (done) => {
          authenticator.restore().catch(() => {
            done();
          });
        });
      });
    });
  });

  describe('#authenticate', () => {
    describe('with hash provided', () => {
      it('authentication should succeed on a proper access token', () => {
        return authenticator.authenticate(accessTokenHash).then((_accessToken) => {
          expect(_accessToken).to.eql(accessToken);
        });
      });

      it('authentication should fail on an invalid access token', () => {
        return authenticator.authenticate('#foo=bar').catch((_err) => {
          expect(_err).to.eql('invalid_token');
        });
      });

      it('authentication should fail on a proper error object', () => {
        return authenticator.authenticate('#error=access_denied').catch((_err) => {
          expect(_err).to.eql('access_denied');
        });
      });
    });
  });

  describe('#invalidate', () => {
    it('returns a resolving promise', (done) => {
      authenticator.invalidate().then(() => {
        done();
      });
    });
  });
});
