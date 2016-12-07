/* jshint expr:true */
import Ember from 'ember';
import { describe, beforeEach, afterEach, it } from 'mocha';
import { expect } from 'chai';
import Pretender from 'pretender';
import Devise from 'ember-simple-auth/authenticators/devise';

const { tryInvoke } = Ember;

describe('DeviseAuthenticator', () => {
  let server;
  let authenticator;

  beforeEach(() => {
    server        = new Pretender();
    authenticator = Devise.create();
  });

  afterEach(() => {
    tryInvoke(server, 'shutdown');
  });

  describe('#restore', () => {
    describe('when the data contains a token and email', () => {
      it('resolves with the correct data', (done) => {
        authenticator.restore({ token: 'secret token!', email: 'user@email.com' }).then((content) => {
          expect(content).to.eql({ token: 'secret token!', email: 'user@email.com' });
          done();
        });
      });
    });

    describe('when the data contains a custom token and email attribute', () => {
      beforeEach(() => {
        authenticator = Devise.extend({ tokenAttributeName: 'employee.token', identificationAttributeName: 'employee.email' }).create();
      });

      it('resolves with the correct data', () => {
        return authenticator.restore({ employee: { token: 'secret token!', email: 'user@email.com' } }).then((content) => {
          expect(content).to.eql({ employee: { token: 'secret token!', email: 'user@email.com' } });
        });
      });
    });
  });

  describe('#authenticate', () => {
    beforeEach(() => {
      server.post('/users/sign_in', () => [201, { 'Content-Type': 'application/json' }, '{ "token": "secret token!", "email": "email@address.com" }']);
    });

    it('sends an AJAX request to the sign in endpoint', () => {
      return authenticator.authenticate('identification', 'password').then(() => {
        let [request] = server.handledRequests;

        expect(request.url).to.eql('/users/sign_in');
        expect(request.method).to.eql('POST');
        expect(JSON.parse(request.requestBody)).to.eql({ user: { email: 'identification', password: 'password' } });
        expect(request.requestHeaders['content-type']).to.eql('application/json');
        expect(request.requestHeaders.accept).to.eql('application/json');
      });
    });

    describe('when the authentication request is successful', () => {
      beforeEach(() => {
        server.post('/users/sign_in', () => [201, { 'Content-Type': 'application/json' }, '{ "token": "secret token!", "email": "email@address.com" }']);
      });

      it('resolves with the correct data', (done) => {
        authenticator.authenticate('email@address.com', 'password').then((data) => {
          expect(true).to.be.true;
          expect(data).to.eql({ token: 'secret token!', email: 'email@address.com' });
          done();
        });
      });

      describe('when the server returns incomplete data', () => {
        it('fails when token is missing', () => {
          server.post('/users/sign_in', () => [201, { 'Content-Type': 'application/json' }, '{ "email": "email@address.com" }']);

          return authenticator.authenticate('email@address.com', 'password').catch((error) => {
            expect(error).to.eql('Check that server response includes token and email');
          });
        });

        it('fails when identification is missing', () => {
          server.post('/users/sign_in', () => [201, { 'Content-Type': 'application/json' }, '{ "token": "secret token!" }']);

          return authenticator.authenticate('email@address.com', 'password').catch((error) => {
            expect(error).to.eql('Check that server response includes token and email');
          });
        });
      });
    });

    describe('when the authentication request fails', () => {
      beforeEach(() => {
        server.post('/users/sign_in', () => [400, { 'Content-Type': 'application/json', 'X-Custom-Context': 'foobar' }, '{ "error": "invalid_grant" }']);
      });

      it('rejects with the correct error', () => {
        return authenticator.authenticate('email@address.com', 'password').catch((error) => {
          expect(error).to.eql({ error: 'invalid_grant' });
        });
      });

      describe('when reject with response is enabled', () => {
        beforeEach(() => {
          authenticator.set('rejectWithResponse', true);
        });

        it('rejects with the response', () => {
          return authenticator.authenticate('username', 'password').catch((response) => {
            expect(response.ok).to.be.false;
          });
        });
      });
    });

    it('can customize the ajax request', () => {
      server.put('/login', () => [201, { 'Content-Type': 'application/json' }, '{ "token": "secret token!", "email": "email@address.com" }']);

      authenticator = Devise.extend({
        makeRequest(config) {
          return this._super(config, { method: 'PUT', url: '/login' });
        }
      }).create();

      return authenticator.authenticate('identification', 'password').then(() => {
        let [request] = server.handledRequests;

        expect(request.url).to.eql('/login');
        expect(request.method).to.eql('PUT');
      });
    });

    it('can handle a resp with the namespace of the resource name', (done) => {
      server.post('/users/sign_in', () => [201, { 'Content-Type': 'application/json' }, '{ "user": { "token": "secret token!", "email": "email@address.com" } }']);

      authenticator.authenticate('email@address.com', 'password').then((data) => {
        expect(true).to.be.true;
        expect(data).to.eql({ token: 'secret token!', email: 'email@address.com' });
        done();
      });
    });

  });

  describe('#invalidate', () => {
    it('returns a resolving promise', (done) => {
      authenticator.invalidate().then(() => {
        expect(true).to.be.true;
        done();
      });
    });
  });
});
