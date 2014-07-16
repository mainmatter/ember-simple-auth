import OAuth2 from 'simple-auth-oauth2/authorizers/oauth2';
import Session from 'simple-auth/session';
import EphemeralStore from 'simple-auth/stores/ephemeral';

describe('OAuth2', function() {
  beforeEach(function() {
    this.authorizer  = OAuth2.create();
    this.request     = { setRequestHeader: function() {} };
    var session     = Session.create();
    session.setProperties({ store: EphemeralStore.create() });
    this.authorizer.set('session', session);
    sinon.spy(this.request, 'setRequestHeader');
  });

  describe('#authorize', function() {
    function itDoesNotAuthorizeTheRequest() {
      it('does not add the "Authorization" header to the request', function() {
        this.authorizer.authorize(this.request, {});

        expect(this.request.setRequestHeader).to.not.have.been.called;
      });
    }

    describe('when the session is authenticated', function() {
      beforeEach(function() {
        this.authorizer.set('session.isAuthenticated', true);
      });

      describe('when the session contains a non empty access_token', function() {
        beforeEach(function() {
          this.authorizer.set('session.access_token', 'secret token!');
        });

        it('adds the "Authorization" header to the request', function() {
          this.authorizer.authorize(this.request, {});

          expect(this.request.setRequestHeader).to.have.been.calledWith('Authorization', 'Bearer secret token!');
        });
      });

      describe('when the session does not contain an access_token', function() {
        beforeEach(function() {
          this.authorizer.set('session.access_token', null);
        });

        itDoesNotAuthorizeTheRequest();
      });
    });

    describe('when the session is not authenticated', function() {
      beforeEach(function() {
        this.authorizer.set('session.isAuthenticated', false);
      });

      itDoesNotAuthorizeTheRequest();
    });
  });
});
