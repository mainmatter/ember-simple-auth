import { computed } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import {
  describe,
  beforeEach,
  afterEach,
  it
} from 'mocha';
import { setOwner } from '@ember/application';
import { setupTest } from 'ember-mocha';
import { expect } from 'chai';
import Pretender from 'pretender';
import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';

describe('OAuth2PasswordGrantAuthenticator', () => {
  setupTest();

  let authenticator;
  let server;
  let parsePostData = ((query) => {
    let result = {};
    query.split('&').forEach((part) => {
      let item = part.split('=');
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  });

  beforeEach(function() {
    authenticator = OAuth2PasswordGrant.create();
    setOwner(authenticator, this.owner);
    server = new Pretender();
  });

  afterEach(function() {
    tryInvoke(server, 'shutdown');
  });

  describe('#restore', function() {
    describe('when the data includes expiration data', function() {
      it('resolves with the correct data', async function() {
        let data = await authenticator.restore({ 'access_token': 'secret token!', 'expires_in': 12345, 'refresh_token': 'refresh token!' });

        expect(data).to.eql({ 'access_token': 'secret token!', 'expires_in': 12345, 'refresh_token': 'refresh token!' });
      });

      describe('when the data includes an expiration time in the past', function() {
        describe('when automatic token refreshing is enabled', function() {
          describe('when the refresh request is successful', function() {
            beforeEach(function() {
              server.post('/token', () => [200, { 'Content-Type': 'application/json' }, '{ "access_token": "secret token 2!", "expires_in": 67890, "refresh_token": "refresh token 2!" }']);
            });

            it('resolves with the correct data', async function() {
              let data = await authenticator.restore({ 'access_token': 'secret token!', 'expires_at': 1 });

              expect(data['expires_at']).to.be.greaterThan(new Date().getTime());
              delete data['expires_at'];
              expect(data).to.eql({ 'access_token': 'secret token 2!', 'expires_in': 67890, 'refresh_token': 'refresh token 2!' });
            });
          });

          describe('when the access token is not refreshed successfully', function() {
            it('returns a rejecting promise', async function() {
              try {
                await authenticator.restore({ 'access_token': 'secret token!', 'expires_at': 1 });
                expect(false).to.be.true;
              } catch (_error) {
                expect(true).to.be.true;
              }
            });
          });
        });

        describe('when automatic token refreshing is disabled', function() {
          beforeEach(function() {
            authenticator.set('refreshAccessTokens', false);
          });

          it('returns a rejecting promise', async function() {
            try {
              await authenticator.restore({ 'access_token': 'secret token!', 'expires_at': 1 });
              expect(false).to.be.true;
            } catch (_error) {
              expect(true).to.be.true;
            }
          });
        });
      });
    });

    describe('when the data does not include expiration data', function() {
      describe('when the data contains an access_token', function() {
        it('resolves with the correct data', async function() {
          let data = await authenticator.restore({ 'access_token': 'secret token!' });

          expect(data).to.eql({ 'access_token': 'secret token!' });
        });
      });

      describe('when the data does not contain an access_token', function() {
        it('returns a rejecting promise', async function() {
          try {
            await authenticator.restore();
            expect(false).to.be.true;
          } catch (_error) {
            expect(true).to.be.true;
          }
        });
      });
    });
  });

  describe('#authenticate', function() {
    it('sends an AJAX request to the token endpoint', async function() {
      server.post('/token', (request) => {
        let body = parsePostData(request.requestBody);

        expect(body).to.eql({
          'grant_type': 'password',
          'username': 'username',
          'password': 'password'
        });

        return [200, { 'Content-Type': 'application/json' }, '{ "access_token": "secret token!" }'];
      });

      await authenticator.authenticate('username', 'password');
    });

    it('sends an AJAX request to the token endpoint with client_id as parameter in the body', async function() {
      server.post('/token', (request) => {
        let body = parsePostData(request.requestBody);

        expect(body).to.eql({
          'client_id': 'test-client',
          'grant_type': 'password',
          'username': 'username',
          'password': 'password'
        });

        return [200, { 'Content-Type': 'application/json' }, '{ "access_token": "secret token!" }'];
      });

      authenticator.set('clientId', 'test-client');
      await authenticator.authenticate('username', 'password');
    });

    it('sends an AJAX request to the token endpoint with customized headers', async function() {
      server.post('/token', (request) => {
        expect(request.requestHeaders['X-Custom-Context']).to.eql('foobar');

        return [200, { 'Content-Type': 'application/json' }, '{ "access_token": "secret token!" }'];
      });

      await authenticator.authenticate('username', 'password', [], { 'X-Custom-Context': 'foobar' });
    });

    it('sends a single OAuth scope to the token endpoint', async function() {
      server.post('/token', (request) => {
        let { requestBody } = request;
        let { scope } = parsePostData(requestBody);

        expect(scope).to.eql('public');

        return [200, { 'Content-Type': 'application/json' }, '{ "access_token": "secret token!" }'];
      });

      await authenticator.authenticate('username', 'password', 'public');
    });

    it('sends multiple OAuth scopes to the token endpoint', async function() {
      server.post('/token', (request) => {
        let { requestBody } = request;
        let { scope } = parsePostData(requestBody);

        expect(scope).to.eql('public private');

        return [200, { 'Content-Type': 'application/json' }, '{ "access_token": "secret token!" }'];
      });

      await authenticator.authenticate('username', 'password', ['public', 'private']);
    });

    describe('when the authentication request is successful', function() {
      beforeEach(function() {
        server.post('/token', () => [200, { 'Content-Type': 'application/json' }, '{ "access_token": "secret token!" }']);
      });

      it('resolves with the correct data', async function() {
        authenticator.set('refreshAccessTokens', false);
        let data = await authenticator.authenticate('username', 'password');

        expect(data).to.eql({ 'access_token': 'secret token!' });
      });

      describe('when the server response includes expiration data', function() {
        beforeEach(function() {
          server.post('/token', () => [200, { 'Content-Type': 'application/json' }, '{ "access_token": "secret token!", "expires_in": 12345, "refresh_token": "refresh token!" }']);
        });

        it('resolves with the correct data', async function() {
          let data = await authenticator.authenticate('username', 'password');

          expect(data['expires_at']).to.be.greaterThan(new Date().getTime());
          delete data['expires_at'];
          expect(data).to.eql({ 'access_token': 'secret token!', 'expires_in': 12345, 'refresh_token': 'refresh token!' });
        });
      });

      describe('when the server response is missing access_token', function() {
        it('fails with a string describing the issue', async function() {
          server.post('/token', () => [200, { 'Content-Type': 'application/json' }, '{}']);

          try {
            await authenticator.authenticate('username', 'password');
            expect(false).to.be.true;
          } catch (error) {
            expect(error).to.eql('access_token is missing in server response');
          }
        });
      });

      describe('but the response is not valid JSON', function() {
        it('fails with the string of the response', async function() {
          server.post('/token', () => [200, { 'Content-Type': 'text/plain' }, 'Something went wrong']);

          try {
            await authenticator.authenticate('username', 'password');
            expect(false).to.be.true;
          } catch (error) {
            expect(error.responseText).to.eql('Something went wrong');
          }
        });
      });
    });

    describe('when the authentication request fails', function() {
      beforeEach(function() {
        server.post('/token', () => [400, { 'Content-Type': 'application/json', 'X-Custom-Context': 'foobar' }, '{ "error": "invalid_grant" }']);
      });

      it('rejects with response object containing responseJSON', async function() {
        try {
          await authenticator.authenticate('username', 'password');
          expect(false).to.be.true;
        } catch (error) {
          expect(error.responseJSON).to.eql({ error: 'invalid_grant' });
        }
      });

      it('provides access to custom headers', async function() {
        try {
          await authenticator.authenticate('username', 'password');
          expect(false).to.be.true;
        } catch (error) {
          expect(error.headers.get('x-custom-context')).to.eql('foobar');
        }
      });
    });

    describe('when the authentication request fails without a valid response', function() {
      beforeEach(function() {
        server.post('/token', () => [500, { 'Content-Type': 'text/plain', 'X-Custom-Context': 'foobar' }, 'The server has failed completely.']);
      });

      it('rejects with response object containing responseText', async function() {
        try {
          await authenticator.authenticate('username', 'password');
          expect(false).to.be.true;
        } catch (error) {
          expect(error.responseJSON).to.not.exist;
          expect(error.responseText).to.eql('The server has failed completely.');
        }
      });

      it('provides access to custom headers', async function() {
        try {
          await authenticator.authenticate('username', 'password');
          expect(false).to.be.true;
        } catch (error) {
          expect(error.headers.get('X-Custom-Context')).to.eql('foobar');
        }
      });
    });
  });

  describe('#invalidate', function() {
    function itSuccessfullyInvalidatesTheSession() {
      it('returns a resolving promise', async function() {
        try {
          await authenticator.invalidate({ 'access_token': 'access token!' });
          expect(true).to.be.true;
        } catch (_error) {
          expect(false).to.be.true;
        }
      });
    }

    describe('when token revokation is enabled', function() {
      beforeEach(function() {
        authenticator.serverTokenRevocationEndpoint = '/revoke';
      });

      it('sends an AJAX request to the revokation endpoint', async function() {
        server.post('/revoke', (request) => {
          let { requestBody } = request;
          let body = parsePostData(requestBody);

          expect(body).to.eql({
            'token_type_hint': 'access_token',
            'token': 'access token!'
          });
        });

        await authenticator.invalidate({ 'access_token': 'access token!' });
      });

      describe('when the revokation request is successful', function() {
        beforeEach(function() {
          server.post('/revoke', () => [200, {}, '']);
        });

        itSuccessfullyInvalidatesTheSession();
      });

      describe('when the revokation request fails', function() {
        beforeEach(function() {
          server.post('/token', () => [400, { 'Content-Type': 'application/json' }, '{ "error": "unsupported_grant_type" }']);
        });

        itSuccessfullyInvalidatesTheSession();
      });

      describe('when a refresh token is set', function() {
        it('sends an AJAX request to invalidate the refresh token', async function() {
          server.post('/revoke', (request) => {
            let { requestBody } = request;
            let body = parsePostData(requestBody);

            expect(body).to.eql({
              'token_type_hint': 'refresh_token',
              'token': 'refresh token!'
            });
          });

          await authenticator.invalidate({ 'access_token': 'access token!', 'refresh_token': 'refresh token!' });
        });
      });
    });

    describe('when token revokation is not enabled', function() {
      itSuccessfullyInvalidatesTheSession();
    });
  });

  describe('#tokenRefreshOffset', function() {
    it('returns a number between 5000 and 10000', function() {
      expect(authenticator.get('tokenRefreshOffset')).to.be.at.least(5000);
      expect(authenticator.get('tokenRefreshOffset')).to.be.below(10000);
    });

    it('can be overridden in a subclass', function() {
      let authenticator = OAuth2PasswordGrant.extend({
        tokenRefreshOffset: computed(function() {
          return 42;
        }),
      }).create();

      expect(authenticator.get('tokenRefreshOffset')).to.equal(42);
    });
  });

  // testing private API here ;(
  describe('#_refreshAccessToken', function() {
    it('sends an AJAX request to the token endpoint', async function() {
      server.post('/token', (request) => {
        let { requestBody } = request;
        let body = parsePostData(requestBody);

        expect(body).to.eql({
          'grant_type': 'refresh_token',
          'refresh_token': 'refresh token!'
        });
      });

      await authenticator._refreshAccessToken(12345, 'refresh token!');
    });

    describe('when the refresh request is successful', function() {
      beforeEach(function() {
        server.post('/token', () => [200, { 'Content-Type': 'application/json' }, '{ "access_token": "secret token 2!" }']);
      });

      it('triggers the "sessionDataUpdated" event', function(done) {
        authenticator.one('sessionDataUpdated', (data) => {
          expect(data['expires_at']).to.be.greaterThan(new Date().getTime());
          delete data['expires_at'];
          expect(data).to.eql({ 'access_token': 'secret token 2!', 'expires_in': 12345, 'refresh_token': 'refresh token!' });

          done();
        });

        authenticator._refreshAccessToken(12345, 'refresh token!');
      });

      describe('when the server response includes updated expiration data', function() {
        beforeEach(function() {
          server.post('/token', () => [200, { 'Content-Type': 'application/json' }, '{ "access_token": "secret token 2!", "expires_in": 67890, "refresh_token": "refresh token 2!" }']);
        });

        it('triggers the "sessionDataUpdated" event with the correct data', function(done) {
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
