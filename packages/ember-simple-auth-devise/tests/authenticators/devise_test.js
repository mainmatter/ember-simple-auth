import { Devise } from 'ember-simple-auth-devise/authenticators/devise';

describe('Devise', function() {
  beforeEach(function() {
    this.authenticator = Devise.create();
  });

  describe('#restore', function() {
    beforeEach(function() {
      this.xhr                = sinon.useFakeXMLHttpRequest();
      this.server             = sinon.fakeServer.create();
      this.server.autoRespond = true;
      sinon.spy($, 'ajax');

      this.server.respondWith('POST', '/users/sign_in', [
        201,
        { 'Content-Type': 'application/json' },
        '{ "auth_token": "secret token!" }'
      ]);
    });

    describe('when the data contains an auth_token and auth_email', function() {
      it('resolves with the correct data', function(done) {
        this.authenticator.restore({ "auth_token": 'secret token!', "auth_email": "user@email.com" }).then(function(content){
          expect(content).to.eql({ "auth_token": "secret token!", "auth_email": "user@email.com" });
          done();
        });
      });
    });

    afterEach(function() {
      this.xhr.restore();
      $.ajax.restore();
    });
  });

  describe('#authenticate', function() {
    beforeEach(function() {
      this.xhr                = sinon.useFakeXMLHttpRequest();
      this.server             = sinon.fakeServer.create();
      this.server.autoRespond = true;
      sinon.spy(Ember.$, 'ajax');
    });

    describe('when the authentication request is successful', function() {
      beforeEach(function() {
        this.server.respondWith('POST', '/users/sign_in', [
          201,
          { 'Content-Type': 'application/json' },
          '{ "access_token": "secret token!" }'
        ]);
      });

      it('resolves with the correct data', function(done) {
        this.authenticator.authenticate({ email: 'email@address.com', password: 'password' }).then(function(data) {
          expect(true).to.be.true;
          expect(data).to.eql({ access_token: 'secret token!' });
          done();
        });
      });
    });

    describe('when the authentication request has remember_me set to true', function() {
      beforeEach(function() {
        this.server.respondWith('POST', '/users/sign_in', [
          201,
          { 'Content-Type': 'application/json' },
          '{ "access_token": "secret token!", "auth_token": "remember" }'
        ]);
      });

      it('resolves with the correct data', function(done) {
        this.authenticator.authenticate({ email: 'email@address.com', password: 'password', remember_me: true }).then(function(data) {
          expect(true).to.be.true;
          expect(data).to.eql({ access_token: 'secret token!', auth_token: 'remember' });
          done();
        });
      });
    });

    describe('when the authentication request fails', function() {
      beforeEach(function() {
        this.server.respondWith('POST', '/users/sign_in', [
          400,
          { 'Content-Type': 'application/json' },
          '{ "error": "invalid_grant" }'
        ]);
      });

      it('rejects with the correct error', function(done) {
        this.authenticator.authenticate({ email: 'email@address.com', password: 'password' }).then(null, function(error) {
          expect(error).to.eql({ "error": "invalid_grant" });
          done();
        });
      });
    });

    afterEach(function() {
      this.xhr.restore();
      Ember.$.ajax.restore();
    });
  });

  describe('#invalidate', function() {
    it('returns a resolving promise', function(done) {
      this.authenticator.invalidate().then(function() {
        expect(true).to.be.true;
        done();
      });
    });
  });
});
