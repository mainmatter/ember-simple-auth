import { Devise } from 'ember-simple-auth-devise/authorizers/devise';
import { Session } from 'ember-simple-auth/session';
import { Ephemeral as EphemeralStore } from 'ember-simple-auth/stores/ephemeral';

describe('Devise', function() {
  beforeEach(function() {
    this.authorizer  = Devise.create();
    this.request     = { setRequestHeader: function() {} };
    this.requestMock = sinon.mock(this.request);
    this.authorizer.set('session', Session.create({ store: EphemeralStore.create() }));
  });

  describe('#authorize', function() {
    function itDoesNotAuthorizeTheRequest() {
      it('does not add the "auth-token" header to the request', function() {
        this.requestMock.expects('setRequestHeader').never();

        this.authorizer.authorize(this.request, {});

        this.requestMock.verify();
      });
    }

    describe('when the session is authenticated', function() {
      beforeEach(function() {
        this.authorizer.set('session.isAuthenticated', true);
      });

      describe('when the session contains a non empty auth_token', function() {
        beforeEach(function() {
          this.authorizer.set('session.auth_token', 'secret token!');
        });

        it('adds the "auth-token" header to the request', function() {
          this.requestMock.expects('setRequestHeader').once().withArgs('auth-token', 'secret token!');
          this.authorizer.authorize(this.request, {});

          this.requestMock.verify();
        });
      });

      describe('when the session does not contain an auth_token', function() {
        beforeEach(function() {
          this.authorizer.set('session.auth_token', null);
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
