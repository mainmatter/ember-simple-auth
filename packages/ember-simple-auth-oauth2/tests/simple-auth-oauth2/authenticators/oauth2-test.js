import OAuth2 from 'simple-auth-oauth2/authenticators/oauth2';
import Configuration from 'simple-auth-oauth2/configuration';

describe('OAuth2', function() {
  beforeEach(function() {
    this.authenticator      = OAuth2.create();
    this.xhr                = sinon.useFakeXMLHttpRequest();
    this.server             = sinon.fakeServer.create();
    this.server.autoRespond = true;
    sinon.spy(Ember.$, 'ajax');
  });

  describe('initilization', function() {
    it('assigns serverTokenEndpoint from the configuration object', function() {
      Configuration.serverTokenEndpoint = 'serverTokenEndpoint';

      expect(OAuth2.create().serverTokenEndpoint).to.eq('serverTokenEndpoint');
    });

    it('assigns serverTokenRevocationEndpoint from the configuration object', function() {
      Configuration.serverTokenRevocationEndpoint = 'serverTokenRevocationEndpoint';

      expect(OAuth2.create().serverTokenRevocationEndpoint).to.eq('serverTokenRevocationEndpoint');
    });

    it('assigns refreshAccessTokens from the configuration object', function() {
      Configuration.refreshAccessTokens = false;

      expect(OAuth2.create().refreshAccessTokens).to.be.false;
    });

    afterEach(function() {
      Configuration.load({}, {});
    });
  });

  describe('#restore', function() {
    context('when the data includes expiration data', function() {
      it('resolves with the correct data', function(done) {
        this.authenticator.restore({ access_token: 'secret token!', expires_in: 12345, refresh_token: 'refresh token!' }).then(function(data) {
          expect(data).to.eql({ access_token: 'secret token!', expires_in: 12345, refresh_token: 'refresh token!' });
          done();
        });
      });

      context('when the data includes an expiration time in the past', function() {
        context('when automatic token refreshing is enabled', function() {
          context('when the refresh request is successful', function() {
            beforeEach(function() {
              this.server.respondWith('POST', '/token', [
                200,
                { 'Content-Type': 'application/json' },
                '{ "access_token": "secret token 2!", "expires_in": 67890, "refresh_token": "refresh token 2!" }'
              ]);
            });

            it('resolves with the correct data', function(done) {
              this.authenticator.restore({ access_token: 'secret token!', expires_at: 1 }).then(function(data) {
                expect(data.expires_at).to.be.greaterThan(new Date().getTime());
                delete data.expires_at;
                expect(data).to.eql({ access_token: 'secret token 2!', expires_in: 67890, refresh_token: 'refresh token 2!' });
                done();
              });
            });
          });

          context('when the access token is not refreshed successfully', function() {
            it('returns a rejecting promise', function(done) {
              this.authenticator.restore({ access_token: 'secret token!', expires_at: 1 }).then(null, function() {
                expect(true).to.be.true;
                done();
              });
            });
          });
        });

        context('when automatic token refreshing is disabled', function() {
          beforeEach(function() {
            this.authenticator.set('refreshAccessTokens', false);
          });

          it('returns a rejecting promise', function(done) {
            this.authenticator.restore({ access_token: 'secret token!', expires_at: 1 }).then(null, function() {
              expect(true).to.be.true;
              done();
            });
          });
        });
      });
    });

    context('when the data does not include expiration data', function() {
      context('when the data contains an access_token', function() {
        it('resolves with the correct data', function(done) {
          this.authenticator.restore({ access_token: 'secret token!' }).then(function(data) {
            expect(data).to.eql({ access_token: 'secret token!' });
            done();
          });
        });
      });

      context('when the data does not contain an access_token', function() {
        it('returns a rejecting promise', function(done) {
          this.authenticator.restore().then(null, function() {
            expect(true).to.be.true;
            done();
          });
        });
      });
    });

    context('when automatic token refreshing is enabled', function() {
      beforeEach(function() {
        sinon.spy(Ember.run, 'later');
      });

      it('schedules a token refresh', function(done) {
        var _this = this;

        this.authenticator.restore({ access_token: 'secret token!', expires_in: 12345, refresh_token: 'refresh token!' }).then(function(data) {
          var spyCall = Ember.run.later.getCall(0);

          expect(spyCall.args[1]).to.eql(_this.authenticator.refreshAccessToken);
          expect(spyCall.args[2]).to.eql(12345);
          expect(spyCall.args[3]).to.eql('refresh token!');
          done();
        });
      });

      afterEach(function() {
        Ember.run.later.restore();
      });
    });

    context('when automatic token refreshing is disabled', function() {
      beforeEach(function() {
        this.authenticator.set('refreshAccessTokens', false);
        sinon.spy(Ember.run, 'later');
      });

      it('does not schedule a token refresh', function(done) {
        var _this = this;

        this.authenticator.restore({ access_token: 'secret token!', expires_in: 12345, refresh_token: 'refresh token!' }).then(function(data) {
          expect(Ember.run.later).to.not.have.been.called;
          done();
        });
      });

      afterEach(function() {
        Ember.run.later.restore();
      });
    });
  });

  describe('#authenticate', function() {
    it('sends an AJAX request to the token endpoint', function(done) {
      this.authenticator.authenticate({ identification: 'username', password: 'password' });

      Ember.run.next(function() {
        expect(Ember.$.ajax.getCall(0).args[0]).to.eql({
          url:         '/token',
          type:        'POST',
          data:        { grant_type: 'password', username: 'username', password: 'password' },
          dataType:    'json',
          contentType: 'application/x-www-form-urlencoded'
        });
        done();
      });
    });

    it('sends a single OAuth scope to the token endpoint', function(done) {
      this.authenticator.authenticate({ identification: 'username', password: 'password', scope: 'public' });

      Ember.run.next(function() {
        expect(Ember.$.ajax.getCall(0).args[0].data.scope).to.eql('public');
        done();
      });
    });

    it('sends multiple OAuth scopes to the token endpoint', function(done) {
      this.authenticator.authenticate({ identification: 'username', password: 'password', scope: ['public', 'private'] });

      Ember.run.next(function() {
        expect(Ember.$.ajax.getCall(0).args[0].data.scope).to.eql('public private');
        done();
      });
    });

    context('when the authentication request is successful', function() {
      beforeEach(function() {
        this.server.respondWith('POST', '/token', [
          200,
          { 'Content-Type': 'application/json' },
          '{ "access_token": "secret token!" }'
        ]);
      });

      it('resolves with the correct data', function(done) {
        this.authenticator.authenticate({ identification: 'username', password: 'password' }).then(function(data) {
          expect(true).to.be.true;
          expect(data).to.eql({ access_token: 'secret token!' });
          done();
        });
      });

      context('when the server response includes expiration data', function() {
        beforeEach(function() {
          this.server.respondWith('POST', '/token', [
            200,
            { 'Content-Type': 'application/json' },
            '{ "access_token": "secret token!", "expires_in": 12345, "refresh_token": "refresh token!" }'
          ]);
        });

        it('resolves with the correct data', function(done) {
          this.authenticator.authenticate({ identification: 'username', password: 'password' }).then(function(data) {
            expect(data.expires_at).to.be.greaterThan(new Date().getTime());
            delete data.expires_at;
            expect(data).to.eql({ access_token: 'secret token!', expires_in: 12345, refresh_token: 'refresh token!' });
            done();
          });
        });

        context('when automatic token refreshing is enabled', function() {
          beforeEach(function() {
            sinon.spy(Ember.run, 'later');
          });

          it('schedules a token refresh', function(done) {
            var _this = this;

            this.authenticator.authenticate({ identification: 'username', password: 'password' }).then(function(data) {
              var spyCall = Ember.run.later.getCall(0);

              expect(spyCall.args[1]).to.eql(_this.authenticator.refreshAccessToken);
              expect(spyCall.args[2]).to.eql(12345);
              expect(spyCall.args[3]).to.eql('refresh token!');
              done();
            });
          });

          afterEach(function() {
            Ember.run.later.restore();
          });
        });

        context('when automatic token refreshing is disabled', function() {
          beforeEach(function() {
            this.authenticator.set('refreshAccessTokens', false);
            sinon.spy(Ember.run, 'later');
          });

          it('does not schedule a token refresh', function(done) {
            var _this = this;

            this.authenticator.authenticate({ identification: 'username', password: 'password' }).then(function(data) {
              expect(Ember.run.later).to.not.have.been.called;
              done();
            });
          });

          afterEach(function() {
            Ember.run.later.restore();
          });
        });
      });
    });

    context('when the authentication request fails', function() {
      beforeEach(function() {
        this.server.respondWith('POST', '/token', [
          400,
          { 'Content-Type': 'application/json' },
          '{ "error": "invalid_grant" }'
        ]);
      });

      it('rejects with the correct error', function(done) {
        this.authenticator.authenticate({ identification: 'username', password: 'password' }).then(null, function(error) {
          expect(error).to.eql({ error: 'invalid_grant' });
          done();
        });
      });
    });
  });

  describe('#invalidate', function() {
    function itSuccessfullyInvalidatesTheSession() {
      it('returns a resolving promise', function(done) {
        this.authenticator.invalidate({ access_token: 'access token!' }).then(function() {
          expect(true).to.be.true;
          done();
        });
      });
    }

    context('when token revokation is enabled', function() {
      beforeEach(function() {
        this.authenticator.serverTokenRevocationEndpoint = '/revoke';
      });

      it('sends an AJAX request to the revokation endpoint', function(done) {
        this.authenticator.invalidate({ access_token: 'access token!' });

        Ember.run.next(function() {
          expect(Ember.$.ajax.getCall(0).args[0]).to.eql({
            url:         '/revoke',
            type:        'POST',
            data:        { token_type_hint: 'access_token', token: 'access token!' },
            dataType:    'json',
            contentType: 'application/x-www-form-urlencoded'
          });
          done();
        });
      });

      context('when the revokation request is successful', function() {
        beforeEach(function() {
          this.server.respondWith('POST', '/revoke', [200, { 'Content-Type': 'application/json' }, '']);
        });

        itSuccessfullyInvalidatesTheSession();
      });

      context('when the revokation request fails', function() {
        beforeEach(function() {
          this.server.respondWith('POST', '/revoke', [400, { 'Content-Type': 'application/json' },
          '{ "error": "unsupported_grant_type" }']);
        });

        itSuccessfullyInvalidatesTheSession();
      });

      context('when a refresh token is set', function() {
        it('sends an AJAX request to invalidate the refresh token', function(done) {
          this.authenticator.invalidate({ access_token: 'access token!', refresh_token: 'refresh token!' });

          Ember.run.next(function() {
            expect(Ember.$.ajax.getCall(1).args[0]).to.eql({
              url:         '/revoke',
              type:        'POST',
              data:        { token_type_hint: 'refresh_token', token: 'refresh token!' },
              dataType:    'json',
              contentType: 'application/x-www-form-urlencoded'
            });
            done();
          });
        });
      });
    });

    context('when token revokation is not enabled', function() {
      itSuccessfullyInvalidatesTheSession();
    });
  });

  // testing private API here ;(
  describe('#refreshAccessToken', function() {
    it('sends an AJAX request to the token endpoint', function(done) {
      this.authenticator.refreshAccessToken(12345, 'refresh token!');

      Ember.run.next(function() {
        expect(Ember.$.ajax.getCall(0).args[0]).to.eql({
          url:         '/token',
          type:        'POST',
          data:        { grant_type: 'refresh_token', refresh_token: 'refresh token!' },
          dataType:    'json',
          contentType: 'application/x-www-form-urlencoded'
        });
        done();
      });
    });

    context('when the refresh request is successful', function() {
      beforeEach(function() {
        this.server.respondWith('POST', '/token', [
          200,
          { 'Content-Type': 'application/json' },
          '{ "access_token": "secret token 2!" }'
        ]);
      });

      it('triggers the "sessionDataUpdated" event', function(done) {
        this.authenticator.one('sessionDataUpdated', function(data) {
          expect(data.expires_at).to.be.greaterThan(new Date().getTime());
          delete data.expires_at;
          expect(data).to.eql({ access_token: 'secret token 2!', expires_in: 12345, refresh_token: 'refresh token!' });
          done();
        });

        this.authenticator.refreshAccessToken(12345, 'refresh token!');
      });

      context('when the server reponse includes updated expiration data', function() {
        beforeEach(function() {
          this.server.respondWith('POST', '/token', [
            200,
            { 'Content-Type': 'application/json' },
            '{ "access_token": "secret token 2!", "expires_in": 67890, "refresh_token": "refresh token 2!" }'
          ]);
        });

        it('triggers the "sessionDataUpdated" event with the correct data', function(done) {
          this.authenticator.one('sessionDataUpdated', function(data) {
            expect(data.expires_at).to.be.greaterThan(new Date().getTime());
            delete data.expires_at;
            expect(data).to.eql({ access_token: 'secret token 2!', expires_in: 67890, refresh_token: 'refresh token 2!' });
            done();
          });

          this.authenticator.refreshAccessToken(12345, 'refresh token!');
        });
      });
    });
  });

  afterEach(function() {
    this.xhr.restore();
    Ember.$.ajax.restore();
  });
});
