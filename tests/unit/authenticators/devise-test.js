/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import Devise from 'ember-simple-auth/authenticators/devise';

describe('DeviseAuthenticator', () => {
  let xhr;
  let server;
  let authenticator;

  beforeEach(() => {
    xhr                = sinon.useFakeXMLHttpRequest();
    server             = sinon.fakeServer.create();
    server.autoRespond = true;
    authenticator      = Devise.create();
  });

  afterEach(() => {
    xhr.restore();
  });

  describe('#restore', () => {
    beforeEach(() => {
      server.respondWith('POST', '/users/sign_in', [
        201,
        { 'Content-Type': 'application/json' },
        '{ "user_token": "secret token!" }'
      ]);
    });

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
      sinon.spy(Ember.$, 'ajax');
    });

    afterEach(() => {
      Ember.$.ajax.restore();
    });

    it('sends an AJAX request to the sign in endpoint', (done) => {
      authenticator.authenticate('identification', 'password');

      Ember.run.next(() => {
        let [args] = Ember.$.ajax.getCall(0).args;
        delete args.beforeSend;
        expect(args).to.eql({
          url:      '/users/sign_in',
          type:     'POST',
          data:     { user: { email: 'identification', password: 'password' } },
          dataType: 'json'
        });
        done();
      });
    });

    describe('when the authentication request is successful', () => {
      beforeEach(() => {
        server.respondWith('POST', '/users/sign_in', [
          201,
          { 'Content-Type': 'application/json' },
          '{ "token": "secret token!", "email": "email@address.com" }'
        ]);
      });

      it('resolves with the correct data', (done) => {
        authenticator.authenticate('email@address.com', 'password').then((data) => {
          expect(true).to.be.true;
          expect(data).to.eql({
            'token': 'secret token!',
            'email': 'email@address.com'
          });
          done();
        });
      });

      describe('when the server returns incomplete data', () => {
        it('fails when token is missing', () => {
          server.respondWith('POST', '/users/sign_in', [
              201,
              { 'Content-Type': 'application/json' },
              '{ "email": "email@address.com" }'
          ]);

          return authenticator.authenticate('email@address.com', 'password').catch((error) => {
            expect(error).to.eql('Check that server response includes token and email');
          });
        });

        it('fails when identification is missing', () => {
          server.respondWith('POST', '/users/sign_in', [
              201,
              { 'Content-Type': 'application/json' },
              '{ "token": "secret token!" }'
          ]);

          return authenticator.authenticate('email@address.com', 'password').catch((error) => {
            expect(error).to.eql('Check that server response includes token and email');
          });
        });
      });
    });

    describe('when the authentication request fails', () => {
      beforeEach(() => {
        server.respondWith('POST', '/users/sign_in', [
          400,
          { 'Content-Type': 'application/json' },
          '{ "error": "invalid_grant" }'
        ]);
      });

      it('rejects with the correct error', (done) => {
        authenticator.authenticate('email@address.com', 'password').catch((error) => {
          expect(error).to.eql({ error: 'invalid_grant' });
          done();
        });
      });
    });

    it('can customize the ajax request', (done) => {
      authenticator = Devise.extend({
        makeRequest(config) {
          return this._super(config, { contentType: 'application/json' });
        }
      }).create();
      authenticator.authenticate('identification', 'password');
      Ember.run.next(() => {
        let [args] = Ember.$.ajax.getCall(0).args;
        expect(args.contentType).to.eql('application/json');
        done();
      });
    });

    it('can handle a resp with the namespace of the resource name', (done) => {
      server.respondWith('POST', '/users/sign_in', [
        201,
        { 'Content-Type': 'application/json' },
        '{ "user": { "token": "secret token!", "email": "email@address.com" } }'
      ]);

      authenticator.authenticate('email@address.com', 'password').then((data) => {
        expect(true).to.be.true;
        expect(data).to.eql({ 'token': 'secret token!', 'email': 'email@address.com' });
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
