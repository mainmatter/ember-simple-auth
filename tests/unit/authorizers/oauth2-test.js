/* jshint expr:true */
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import OAuth2Bearer from 'ember-simple-auth/authorizers/oauth2-bearer';
import Session from 'ember-simple-auth/session';
import EphemeralStore from 'ember-simple-auth/stores/ephemeral';

describe('OAuth2Bearer', function() {
  beforeEach(function() {
    this.authorizer  = OAuth2Bearer.create();
    this.request     = {
      setRequestHeader() {}
    };
    let session = Session.create({ store: EphemeralStore.create() });
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
          this.authorizer.set('session.secure.access_token', 'secret token!');
        });

        it('adds the "Authorization" header to the request', function() {
          this.authorizer.authorize(this.request, {});

          expect(this.request.setRequestHeader).to.have.been.calledWith('Authorization', 'Bearer secret token!');
        });
      });

      describe('when the session does not contain an access_token', function() {
        beforeEach(function() {
          this.authorizer.set('session.secure.access_token', null);
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
