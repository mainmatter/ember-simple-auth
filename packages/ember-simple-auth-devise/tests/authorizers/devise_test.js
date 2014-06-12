import Devise from 'ember-simple-auth-devise/authorizers/devise';
import Session from 'ember-simple-auth/session';
import EphemeralStore from 'ember-simple-auth/stores/ephemeral';

describe('Devise', function() {
  beforeEach(function() {
    this.authorizer  = Devise.create();
    this.request     = { setRequestHeader: function() {} };
    this.requestMock = sinon.mock(this.request);
    this.authorizer.set('session', Session.create({ store: EphemeralStore.create() }));
  });

  describe('#authorize', function() {
    function itDoesNotAuthorizeTheRequest() {
      it('does not add the "user-token" header to the request', function() {
        this.requestMock.expects('setRequestHeader').never();

        this.authorizer.authorize(this.request, {});

        this.requestMock.verify();
      });
    }

    describe('when the session is authenticated', function() {
      beforeEach(function() {
        this.authorizer.set('session.isAuthenticated', true);
      });

      describe('when the session contains a non empty user_token and user_email', function() {
        beforeEach(function() {
          this.authorizer.set('session.user_token', 'secret token!');
          this.authorizer.set('session.user_email', 'user@email.com');
        });

        it('adds the "user_token" and "user_email" query string fields to the request', function() {
          this.requestMock.expects('setRequestHeader').once().withArgs('Authorization', 'Token token="secret token!", user_email="user@email.com"');
          this.authorizer.authorize(this.request, {});

          this.requestMock.verify();
        });
      });

      describe('when the session does not contain an user_token', function() {
        beforeEach(function() {
          this.authorizer.set('session.user_token', null);
        });

        itDoesNotAuthorizeTheRequest();
      });

      describe('when the session does not contain an user_email', function() {
        beforeEach(function() {
          this.authorizer.set('session.user_email', null);
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
