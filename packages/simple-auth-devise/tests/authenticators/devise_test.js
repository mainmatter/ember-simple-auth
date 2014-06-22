import Devise from 'simple-auth-devise/authenticators/devise';

describe('Devise', function() {
  beforeEach(function() {
    this.xhr                = sinon.useFakeXMLHttpRequest();
    this.server             = sinon.fakeServer.create();
    this.server.autoRespond = true;
    this.authenticator      = Devise.create();
  });

  describe('#restore', function() {
    beforeEach(function() {
      this.server.respondWith('POST', '/users/sign_in', [
        201,
        { 'Content-Type': 'application/json' },
        '{ "user_token": "secret token!" }'
      ]);
    });

    describe('when the data contains an user_token and user_email', function() {
      it('resolves with the correct data', function(done) {
        this.authenticator.restore({ "user_token": 'secret token!', "user_email": "user@email.com" }).then(function(content){
          expect(content).to.eql({ "user_token": "secret token!", "user_email": "user@email.com" });
          done();
        });
      });
    });
  });

  describe('#authenticate', function() {
    beforeEach(function() {
      sinon.spy(Ember.$, 'ajax');
    });

    it('sends an AJAX request to the sign in endpoint', function(done) {
      this.authenticator.authenticate({ identification: 'identification', password: 'password' });

      Ember.run.next(function() {
        var args = Ember.$.ajax.getCall(0).args[0];
        delete args.beforeSend;
        expect(args).to.eql({
          url:      '/users/sign_in',
          type:     'POST',
          data:     { user: { email: 'identification', password: 'password' } },
          dataType: 'json',
        });
        done();
      });
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

  afterEach(function() {
    this.xhr.restore();
  });
});
