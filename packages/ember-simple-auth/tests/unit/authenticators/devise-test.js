import { tryInvoke } from '@ember/utils';
import {
  describe,
  beforeEach,
  afterEach,
  it
} from 'mocha';
import { expect } from 'chai';
import Pretender from 'pretender';
import Devise from 'ember-simple-auth/authenticators/devise';

describe('DeviseAuthenticator', () => {
  let server;
  let authenticator;

  beforeEach(function() {
    server = new Pretender();
    authenticator = Devise.create();
  });

  afterEach(function() {
    tryInvoke(server, 'shutdown');
  });

  describe('#restore', function() {
    describe('when the data contains a token and email', function() {
      it('resolves with the correct data', async function() {
        let content = await authenticator.restore({ token: 'secret token!', email: 'user@email.com' });

        expect(content).to.eql({ token: 'secret token!', email: 'user@email.com' });
      });
    });

    describe('when the data contains a custom token and email attribute', function() {
      beforeEach(function() {
        authenticator = Devise.extend({ tokenAttributeName: 'employee.token', identificationAttributeName: 'employee.email' }).create();
      });

      it('resolves with the correct data', async function() {
        let content = await authenticator.restore({ employee: { token: 'secret token!', email: 'user@email.com' } });

        expect(content).to.eql({ employee: { token: 'secret token!', email: 'user@email.com' } });
      });
    });
  });

  describe('#authenticate', function() {
    beforeEach(function() {
      server.post('/users/sign_in', () => [201, { 'Content-Type': 'application/json' }, '{ "token": "secret token!", "email": "email@address.com" }']);
    });

    it('sends an AJAX request to the sign in endpoint', async function() {
      await authenticator.authenticate('identification', 'password');
      let [request] = server.handledRequests;

      expect(request.url).to.eql('/users/sign_in');
      expect(request.method).to.eql('POST');
      expect(JSON.parse(request.requestBody)).to.eql({ user: { email: 'identification', password: 'password' } });
      expect(request.requestHeaders['content-type']).to.eql('application/json');
      expect(request.requestHeaders.accept).to.eql('application/json');
    });

    describe('when the authentication request is successful', function() {
      beforeEach(function() {
        server.post('/users/sign_in', () => [201, { 'Content-Type': 'application/json' }, '{ "token": "secret token!", "email": "email@address.com" }']);
      });

      it('resolves with the correct data', async function() {
        let data = await authenticator.authenticate('email@address.com', 'password');

        expect(data).to.eql({ token: 'secret token!', email: 'email@address.com' });
      });

      describe('when the server returns incomplete data', function() {
        it('fails when token is missing', async function() {
          server.post('/users/sign_in', () => [201, { 'Content-Type': 'application/json' }, '{ "email": "email@address.com" }']);

          try {
            await authenticator.authenticate('email@address.com', 'password');
            expect(false).to.be.true;
          } catch (error) {
            expect(error).to.eql('Check that server response includes token and email');
          }
        });

        it('fails when identification is missing', async function() {
          server.post('/users/sign_in', () => [201, { 'Content-Type': 'application/json' }, '{ "token": "secret token!" }']);

          try {
            await authenticator.authenticate('email@address.com', 'password');
            expect(false).to.be.true;
          } catch (error) {
            expect(error).to.eql('Check that server response includes token and email');
          }
        });
      });
    });

    describe('when the authentication request fails', function() {
      beforeEach(function() {
        server.post('/users/sign_in', () => [400, { 'Content-Type': 'application/json', 'X-Custom-Context': 'foobar' }, '{ "error": "invalid_grant" }']);
      });

      it('rejects with the response', async function() {
        try {
          await authenticator.authenticate('username', 'password');
          expect(false).to.be.true;
        } catch (response) {
          expect(response.ok).to.be.false;
        }
      });
    });

    it('can customize the ajax request', async function() {
      server.put('/login', () => [201, { 'Content-Type': 'application/json' }, '{ "token": "secret token!", "email": "email@address.com" }']);

      authenticator = Devise.extend({
        makeRequest(config) {
          return this._super(config, { method: 'PUT', url: '/login' });
        }
      }).create();

      await authenticator.authenticate('identification', 'password');

      let [request] = server.handledRequests;

      expect(request.url).to.eql('/login');
      expect(request.method).to.eql('PUT');
    });

    it('can handle a resp with the namespace of the resource name', async function() {
      server.post('/users/sign_in', () => [201, { 'Content-Type': 'application/json' }, '{ "user": { "token": "secret token!", "email": "email@address.com" } }']);

      let data = await authenticator.authenticate('email@address.com', 'password');

      expect(true).to.be.true;
      expect(data).to.eql({ token: 'secret token!', email: 'email@address.com' });
    });

  });

  describe('#invalidate', function() {
    it('returns a resolving promise', async function() {
      try {
        await authenticator.invalidate();
        expect(true).to.be.true;
      } catch (_error) {
        expect(false).to.be.true;
      }
    });
  });
});
