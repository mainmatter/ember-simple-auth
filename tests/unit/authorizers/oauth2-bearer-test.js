import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import OAuth2BearerAuthorizer from 'ember-simple-auth/authorizers/oauth2-bearer';

describe('OAuth2BearerAuthorizer', () => {
  let authorizer;
  let data;
  let block;

  beforeEach(function() {
    authorizer = OAuth2BearerAuthorizer.create();
    block = sinon.spy();
  });

  describe('#authorize', function() {
    function itDoesNotAuthorizeTheRequest() {
      it('does not call the block', function() {
        authorizer.authorize(data, block);

        expect(block).to.not.have.been.called;
      });
    }

    describe('when the session data contains a non empty access_token', function() {
      beforeEach(function() {
        data = {
          'access_token': 'secret token!'
        };
      });

      it('calls the block with a Bearer token header', function() {
        authorizer.authorize(data, block);

        expect(block).to.have.been.calledWith('Authorization', 'Bearer secret token!');
      });
    });

    describe('when the session does not contain an access_token', function() {
      beforeEach(function() {
        data = {};
      });

      itDoesNotAuthorizeTheRequest();
    });
  });
});
