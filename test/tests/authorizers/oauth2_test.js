import { OAuth2 } from 'ember-simple-auth/authorizers/oauth2';
import { Session } from 'ember-simple-auth/session';
import { Ephemeral as EphemeralStore } from 'ember-simple-auth/stores/ephemeral';

describe('Authorizers.OAuth2', function() {
  beforeEach(function() {
    this.authorizer  = OAuth2.create();
    this.request     = new XMLHttpRequest();
    this.requestMock = sinon.mock(this.request);
  });

  describe('#authorize', function() {
    describe('when the session has a non empty access_token', function() {
      beforeEach(function() {
        this.authorizer.set('session', Session.create({ store: EphemeralStore.create() }));
        this.authorizer.set('session.access_token', 'secret token!');
      });

      it('adds the "Authorization" header to the request', function() {
        this.requestMock.expects('setRequestHeader').once().withArgs('Authorization', 'Bearer secret token!');

        this.authorizer.authorize(this.request);

        this.requestMock.verify();
      });
    });

    describe('when the session has no access_token', function() {
      it('does not add the "Authorization" header to the request', function() {
        this.requestMock.expects('setRequestHeader').never();

        this.authorizer.authorize(this.request);

        this.requestMock.verify();
      });
    });
  });
});
