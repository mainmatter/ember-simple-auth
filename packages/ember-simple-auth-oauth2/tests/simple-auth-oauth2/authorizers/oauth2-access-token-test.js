import AccessToken from 'simple-auth-oauth2/authorizers/oauth2-access-token';
import Session from 'simple-auth/session';
import EphemeralStore from 'simple-auth/stores/ephemeral';

describe('OAuth2 Access Token', function() {
  beforeEach(function() {
    this.authorizer     = AccessToken.create();
    this.request        = {};
    this.requestOptions = {};
    var session         = Session.create();
    session.setProperties({ store: EphemeralStore.create() });
    this.authorizer.set('session', session);
  });

  describe('#authorize', function() {
    function itDoesNotAuthorizeTheRequest() {
      it('does not add the "access_token" to the requestOptions', function() {
        this.authorizer.authorize(this.request, this.requestOptions);

        expect(this.requestOptions.data).to.not.contain('access_token');
      });
    }

    context('when the session is authenticated', function() {
      beforeEach(function() {
        this.authorizer.set('session.isAuthenticated', true);
      });

      context('when the session contains a non empty access_token', function() {
        beforeEach(function() {
          this.authorizer.set('session.access_token', 'secret token!');
        });

        context('when the contentType is application/json', function(){
          beforeEach(function(){
            this.requestOptions.contentType = 'application/json';
          });

          context('when the data is not set', function(){
            it('adds the "access_token" to the requestOptions.data', function(){
              this.authorizer.authorize(this.request, this.requestOptions);

              var jsonData = JSON.parse(this.requestOptions.data);
              expect(jsonData).to.deep.equal({access_token: 'secret token!'});
            });
          });

          context('when the data has existing json', function(){
            beforeEach(function(){
              this.requestOptions.data = JSON.stringify({user: {email: 'foo@example.com'}});
            });

            it('adds the "access_token" to the json', function(){
              this.authorizer.authorize(this.request, this.requestOptions);

              var jsonData = JSON.parse(this.requestOptions.data);
              expect(jsonData).to.deep.equal({user: {email: 'foo@example.com'}, access_token: 'secret token!'});
            });
          });
        });

        context('when the contentType is application/x-www-form-urlencoded', function(){
          beforeEach(function(){
            this.requestOptions.contentType = 'application/x-www-form-urlencoded';
          });

          context('when the data is not set', function(){
            it('adds the "access_token" to the requestOptions.data', function(){
              this.authorizer.authorize(this.request, this.requestOptions);

              expect(this.requestOptions.data).to.equal('access_token=secret+token!');
            });
          });

          context('when the data has existing form data', function(){
            beforeEach(function(){
              this.requestOptions.data = Ember.$.param({user: {email: 'foo@example.com'}});
            });

            it('adds the "access_token" to the json', function(){
              this.authorizer.authorize(this.request, this.requestOptions);

              expect(this.requestOptions.data).to.equal('user%5Bemail%5D=foo%40example.com&access_token=secret+token!');
            });
          });

          context('when the data is a FormData', function(){
            beforeEach(function(){
              this.requestOptions.data = { append: function(){} };
              sinon.spy(this.requestOptions.data, 'append');
            });

            it('adds the "access_token" to the json', function(){
              this.authorizer.authorize(this.request, this.requestOptions);

              expect(this.requestOptions.data.append).to.have.been.calledWith('access_token', 'secret token!');
            });
          });
        });
      });

      context('when the session does not contain an access_token', function() {
        beforeEach(function() {
          this.authorizer.set('session.access_token', null);
        });

        itDoesNotAuthorizeTheRequest();
      });
    });

    context('when the session is not authenticated', function() {
      beforeEach(function() {
        this.authorizer.set('session.isAuthenticated', false);
      });

      itDoesNotAuthorizeTheRequest();
    });
  });
});
