import Devise from 'simple-auth-devise/authenticators/devise';
import Configuration from 'simple-auth-devise/configuration';

describe('Devise', function() {
  beforeEach(function() {
    this.xhr                = sinon.useFakeXMLHttpRequest();
    this.server             = sinon.fakeServer.create();
    this.server.autoRespond = true;
    this.authenticator      = Devise.create();
  });

  describe('initilization', function() {
    it('assigns serverTokenEndpoint from the configuration object', function() {
      Configuration.serverTokenEndpoint = 'serverTokenEndpoint';

      expect(Devise.create().serverTokenEndpoint).to.eq('serverTokenEndpoint');
    });

    it('assigns resourceName from the configuration object', function() {
      Configuration.resourceName = 'resourceName';

      expect(Devise.create().resourceName).to.eq('resourceName');
    });

    it('assigns tokenAttributeName from the configuration object', function() {
      Configuration.tokenAttributeName = 'tokenAttributeName';

      expect(Devise.create().tokenAttributeName).to.eq('tokenAttributeName');
    });

    it('assigns identificationAttributeName from the configuration object', function() {
      Configuration.identificationAttributeName = 'identificationAttributeName';

      expect(Devise.create().identificationAttributeName).to.eq('identificationAttributeName');
    });

    afterEach(function() {
      Configuration.load({}, {});
    });
  });

  describe('#restore', function() {
    beforeEach(function() {
      this.server.respondWith('POST', '/users/sign_in', [
        201,
        { 'Content-Type': 'application/json' },
        '{ "user_token": "secret token!" }'
      ]);
    });

    context('when the data contains a token and user_email', function() {
      it('resolves with the correct data', function(done) {
        this.authenticator.restore({ "token": 'secret token!', "user_email": "user@email.com" }).then(function(content){
          expect(content).to.eql({ "token": "secret token!", "user_email": "user@email.com" });
          done();
        });
      });
    });

    context('when the data contains a custom token and email attribute', function() {
      beforeEach(function() {
        Configuration.tokenAttributeName          = 'employee.token';
        Configuration.identificationAttributeName = 'employee.email';
        this.authenticator                        = Devise.create();
      });

      it('resolves with the correct data', function(done) {
        this.authenticator.restore({ employee: { token: 'secret token!', email: 'user@email.com' } }).then(function(content){
          expect(content).to.eql({ employee: { token: 'secret token!', email: 'user@email.com' } });
          done();
        });
      });

      afterEach(function() {
        Configuration.load({}, {});
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
          data:     { user: { user_email: 'identification', password: 'password' } },
          dataType: 'json',
        });
        done();
      });
    });

    context('when the authentication request is successful', function() {
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

    context('when the authentication request fails', function() {
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
