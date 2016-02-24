/* jshint expr:true */
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import OAuth2BearerAuthorizer from 'ember-simple-auth/authorizers/oauth2-bearer';

describe('OAuth2BearerAuthorizer', () => {
  let authorizer;
  let data;
  let block;

  beforeEach(() => {
    authorizer = OAuth2BearerAuthorizer.create();
    block = sinon.spy();
  });

  describe('#authorize', () => {
    function itDoesNotAuthorizeTheRequest() {
      it('does not call the block', () => {
        authorizer.authorize(data, block);

        expect(block).to.not.have.been.called;
      });
    }

    describe('when the session data contains a non empty access_token', () => {
      beforeEach(() => {
        data  = {
          'access_token': 'secret token!'
        };
      });

      it('synchronously calls the block with a Bearer token header', () => {
        authorizer.authorize(data, block);

        expect(block).to.have.been.calledWith('Authorization', 'Bearer secret token!');
      });

      it('asynchronously calls the block with a Bearer token header', (done) => {
        const result = authorizer.authorize(data);
        expect(result.then).to.be.a('function');
        result.then((auth) => {
          const { headerName, headerValue } = auth;
          expect(headerName).to.be.equal('Authorization');
          expect(headerValue).to.be.equal('Bearer secret token!');
        }).then(done, done);
      });
    });

    describe('when the session does not contain an access_token', () => {
      beforeEach(() => {
        data = {};
      });

      itDoesNotAuthorizeTheRequest();
    });
  });
});
