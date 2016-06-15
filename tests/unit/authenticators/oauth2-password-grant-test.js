/* jshint expr:true */
/* jscs:disable requireDotNotation */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';

describe('OAuth2PasswordGrantAuthenticator', () => {
  let authenticator;
  let xhr;
  let server;

  beforeEach(() => {
    authenticator      = OAuth2PasswordGrant.create();
    xhr                = sinon.useFakeXMLHttpRequest();
    server             = sinon.fakeServer.create();
    server.autoRespond = true;
    sinon.spy(Ember.$, 'ajax');
  });

  afterEach(() => {
    xhr.restore();
    Ember.$.ajax.restore();
  });

  describe('#restore', () => {
    describe('when the data includes expiration data', () => {
      it('resolves with the correct data', (done) => {
        authenticator.restore({ 'access_token': 'secret token!', 'expires_in': 12345, 'refresh_token': 'refresh token!' }).then((data) => {
          expect(data).to.eql({ 'access_token': 'secret token!', 'expires_in': 12345, 'refresh_token': 'refresh token!' });
          done();
        });
      });

      describe('when the data includes an expiration time in the past', () => {
        describe('when automatic token refreshing is enabled', () => {
          describe('when the refresh request is successful', () => {
            beforeEach(() => {
              server.respondWith('POST', '/token', [
                200,
                { 'Content-Type': 'application/json' },
                '{ "access_token": "secret token 2!", "expires_in": 67890, "refresh_token": "refresh token 2!" }'
              ]);
            });

            it('resolves with the correct data', (done) => {
              authenticator.restore({ 'access_token': 'secret token!', 'expires_at': 1 }).then((data) => {
                expect(data['expires_at']).to.be.greaterThan(new Date().getTime());
                delete data['expires_at'];
                expect(data).to.eql({ 'access_token': 'secret token 2!', 'expires_in': 67890, 'refresh_token': 'refresh token 2!' });
                done();
              });
            });
          });

          describe('when the access token is not refreshed successfully', () => {
            it('returns a rejecting promise', (done) => {
              authenticator.restore({ 'access_token': 'secret token!', 'expires_at': 1 }).catch(() => {
                expect(true).to.be.true;
                done();
              });
            });
          });
        });

        describe('when automatic token refreshing is disabled', () => {
          beforeEach(() => {
            authenticator.set('refreshAccessTokens', false);
          });

          it('returns a rejecting promise', (done) => {
            authenticator.restore({ 'access_token': 'secret token!', 'expires_at': 1 }).catch(() => {
              expect(true).to.be.true;
              done();
            });
          });
        });
      });
    });

    describe('when the data does not include expiration data', () => {
      describe('when the data contains an access_token', () => {
        it('resolves with the correct data', (done) => {
          authenticator.restore({ 'access_token': 'secret token!' }).then((data) => {
            expect(data).to.eql({ 'access_token': 'secret token!' });
            done();
          });
        });
      });

      describe('when the data does not contain an access_token', () => {
        it('returns a rejecting promise', (done) => {
          authenticator.restore().catch(() => {
            expect(true).to.be.true;
            done();
          });
        });
      });
    });
  });

  describe('#authenticate', () => {
    it('sends an AJAX request to the token endpoint', (done) => {
      authenticator.authenticate('username', 'password');

      Ember.run.next(() => {
        expect(Ember.$.ajax.getCall(0).args[0]).to.eql({
          url:         '/token',
          type:        'POST',
          data:        { 'grant_type': 'password', username: 'username', password: 'password' },
          dataType:    'json',
          contentType: 'application/x-www-form-urlencoded'
        });
        done();
      });
    });

    it('sends an AJAX request to the token endpoint with client_id Basic Auth header', function(done) {
      authenticator.set('clientId', 'test-client');
      authenticator.authenticate('username', 'password');

      Ember.run.next(() => {
        expect(Ember.$.ajax.getCall(0).args[0]).to.eql({
          url:         '/token',
          type:        'POST',
          data:        { 'grant_type': 'password', username: 'username', password: 'password' },
          dataType:    'json',
          contentType: 'application/x-www-form-urlencoded',
          headers:     { Authorization: 'Basic dGVzdC1jbGllbnQ6' }
        });
        done();
      });
    });

    it('sends a single OAuth scope to the token endpoint', function(done) {
      authenticator.authenticate('username', 'password', 'public');

      Ember.run.next(() => {
        expect(Ember.$.ajax.getCall(0).args[0].data.scope).to.eql('public');
        done();
      });
    });

    it('sends multiple OAuth scopes to the token endpoint', (done) => {
      authenticator.authenticate('username', 'password', ['public', 'private']);

      Ember.run.next(() => {
        expect(Ember.$.ajax.getCall(0).args[0].data.scope).to.eql('public private');
        done();
      });
    });

    describe('when the authentication request is successful', () => {
      beforeEach(() => {
        server.respondWith('POST', '/token', [
          200,
          { 'Content-Type': 'application/json' },
          '{ "access_token": "secret token!" }'
        ]);
      });

      it('resolves with the correct data', (done) => {
        authenticator.set('refreshAccessTokens', false);
        authenticator.authenticate('username', 'password').then((data) => {
          expect(true).to.be.true;
          expect(data).to.eql({ 'access_token': 'secret token!' });
          done();
        });
      });

      describe('when the server response includes expiration data', () => {
        beforeEach(() => {
          server.respondWith('POST', '/token', [
            200,
            { 'Content-Type': 'application/json' },
            '{ "access_token": "secret token!", "expires_in": 12345, "refresh_token": "refresh token!" }'
          ]);
        });

        it('resolves with the correct data', (done) => {
          authenticator.authenticate('username', 'password').then((data) => {
            expect(data['expires_at']).to.be.greaterThan(new Date().getTime());
            delete data['expires_at'];
            expect(data).to.eql({ 'access_token': 'secret token!', 'expires_in': 12345, 'refresh_token': 'refresh token!' });
            done();
          });
        });
      });

      describe('when the server returns incomplete data', () => {
        it('fails when no access_token is present', () => {
          server.respondWith('POST', '/token', [
              200,
              { 'Content-Type': 'application/json' },
              '{}'
          ]);

          return authenticator.authenticate('username', 'password').catch((error) => {
            expect(error).to.eql('access_token is missing in server response');
          });
        });
      });
    });

    describe('when the authentication request fails', () => {
      beforeEach(() => {
        server.respondWith('POST', '/token', [
          400,
          { 'Content-Type': 'application/json' },
          '{ "error": "invalid_grant" }'
        ]);
      });

      it('rejects with the correct error', (done) => {
        authenticator.authenticate('username', 'password').catch((error) => {
          expect(error).to.eql({ error: 'invalid_grant' });
          done();
        });
      });
    });
  });

  describe('#invalidate', () => {
    function itSuccessfullyInvalidatesTheSession() {
      it('returns a resolving promise', (done) => {
        authenticator.invalidate({ 'access_token': 'access token!' }).then(() => {
          expect(true).to.be.true;
          done();
        });
      });
    }

    describe('when token revokation is enabled', () => {
      beforeEach(() => {
        authenticator.serverTokenRevocationEndpoint = '/revoke';
      });

      it('sends an AJAX request to the revokation endpoint', (done) => {
        authenticator.invalidate({ 'access_token': 'access token!' });

        Ember.run.next(() => {
          expect(Ember.$.ajax.getCall(0).args[0]).to.eql({
            url:         '/revoke',
            type:        'POST',
            data:        { 'token_type_hint': 'access_token', token: 'access token!' },
            dataType:    'json',
            contentType: 'application/x-www-form-urlencoded'
          });
          done();
        });
      });

      describe('when the revokation request is successful', () => {
        beforeEach(() => {
          server.respondWith('POST', '/revoke', [200, { 'Content-Type': 'application/json' }, '']);
        });

        itSuccessfullyInvalidatesTheSession();
      });

      describe('when the revokation request fails', () => {
        beforeEach(() => {
          server.respondWith('POST', '/revoke', [400, { 'Content-Type': 'application/json' },
          '{ "error": "unsupported_grant_type" }']);
        });

        itSuccessfullyInvalidatesTheSession();
      });

      describe('when a refresh token is set', () => {
        it('sends an AJAX request to invalidate the refresh token', (done) => {
          authenticator.invalidate({ 'access_token': 'access token!', 'refresh_token': 'refresh token!' });

          Ember.run.next(() => {
            expect(Ember.$.ajax.getCall(1).args[0]).to.eql({
              url:         '/revoke',
              type:        'POST',
              data:        { 'token_type_hint': 'refresh_token', token: 'refresh token!' },
              dataType:    'json',
              contentType: 'application/x-www-form-urlencoded'
            });
            done();
          });
        });
      });
    });

    describe('when token revokation is not enabled', () => {
      itSuccessfullyInvalidatesTheSession();
    });
  });

  describe('#tokenRefreshOffset', () => {
    it('returns a number between 5000 and 10000', (done) => {
      expect(authenticator.get('tokenRefreshOffset')).to.be.at.least(5000);
      expect(authenticator.get('tokenRefreshOffset')).to.be.below(10000);
      done();
    });
  });

  // testing private API here ;(
  describe('#_refreshAccessToken', () => {
    it('sends an AJAX request to the token endpoint', (done) => {
      authenticator._refreshAccessToken(12345, 'refresh token!');

      Ember.run.next(() => {
        expect(Ember.$.ajax.getCall(0).args[0]).to.eql({
          url:         '/token',
          type:        'POST',
          data:        { 'grant_type': 'refresh_token', 'refresh_token': 'refresh token!' },
          dataType:    'json',
          contentType: 'application/x-www-form-urlencoded'
        });
        done();
      });
    });

    describe('when the refresh request is successful', () => {
      beforeEach(() => {
        server.respondWith('POST', '/token', [
          200,
          { 'Content-Type': 'application/json' },
          '{ "access_token": "secret token 2!" }'
        ]);
      });

      it('triggers the "sessionDataUpdated" event', (done) => {
        authenticator.one('sessionDataUpdated', (data) => {
          expect(data['expires_at']).to.be.greaterThan(new Date().getTime());
          delete data['expires_at'];
          expect(data).to.eql({ 'access_token': 'secret token 2!', 'expires_in': 12345, 'refresh_token': 'refresh token!' });
          done();
        });

        authenticator._refreshAccessToken(12345, 'refresh token!');
      });

      describe('when the server reponse includes updated expiration data', () => {
        beforeEach(() => {
          server.respondWith('POST', '/token', [
            200,
            { 'Content-Type': 'application/json' },
            '{ "access_token": "secret token 2!", "expires_in": 67890, "refresh_token": "refresh token 2!" }'
          ]);
        });

        it('triggers the "sessionDataUpdated" event with the correct data', (done) => {
          authenticator.one('sessionDataUpdated', (data) => {
            expect(data['expires_at']).to.be.greaterThan(new Date().getTime());
            delete data['expires_at'];
            expect(data).to.eql({ 'access_token': 'secret token 2!', 'expires_in': 67890, 'refresh_token': 'refresh token 2!' });
            done();
          });

          authenticator._refreshAccessToken(12345, 'refresh token!');
        });
      });
    });
  });
});
