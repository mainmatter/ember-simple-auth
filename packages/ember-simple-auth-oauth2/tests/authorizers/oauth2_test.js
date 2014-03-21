import { OAuth2 } from 'ember-simple-auth-oauth2/authorizers/oauth2';
import { Session } from 'ember-simple-auth/session';
import { Ephemeral as EphemeralStore } from 'ember-simple-auth/stores/ephemeral';

describe('OAuth2', function() {
  beforeEach(function() {
    this.authorizer  = OAuth2.create();
    this.request     = { setRequestHeader: function() {} };
    this.requestMock = sinon.mock(this.request);
    this.authorizer.set('session', Session.create({ store: EphemeralStore.create() }));
  });

  describe('#authorize', function() {
    function itDoesNotAuthorizeTheRequest() {
      it('does not add the "Authorization" header to the request', function() {
        this.requestMock.expects('setRequestHeader').never();

        this.authorizer.authorize(this.request, {});

        this.requestMock.verify();
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
          this.requestMock.expects('setRequestHeader').once().withArgs('Authorization', 'Bearer secret token!');
          this.authorizer.authorize(this.request, {});

          this.requestMock.verify();
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
