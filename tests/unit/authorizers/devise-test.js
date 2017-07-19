import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import Devise from 'ember-simple-auth/authorizers/devise';

describe('DeviseAuthorizer', () => {
  let authorizer;
  let block;
  let data;

  beforeEach(function() {
    authorizer = Devise.create();
    block = sinon.spy();
  });

  describe('#authorize', function() {
    function itDoesNotAuthorizeTheRequest() {
      it('does not call the block', function() {
        authorizer.authorize(data, block);

        expect(block).to.not.have.been.called;
      });
    }

    describe('when the session data contains a non empty token and email', function() {
      beforeEach(function() {
        data = {
          token: 'secret token!',
          email: 'user@email.com'
        };
      });

      it('calls the block with a header containing "token" and "email"', function() {
        authorizer.authorize(data, block);

        expect(block).to.have.been.calledWith('Authorization', 'Token token="secret token!", email="user@email.com"');
      });
    });

    describe('when custom identification and token attribute names are configured', function() {
      beforeEach(function() {
        authorizer = Devise.extend({ tokenAttributeName: 'employee_token', identificationAttributeName: 'employee_email' }).create();
      });

      describe('when the session data contains a non empty employee_token and employee_email', function() {
        beforeEach(function() {
          data = {
            'employee_token': 'secret token!',
            'employee_email': 'user@email.com'
          };
        });

        it('calls the block with a header containing "employee_token" and "employee_email"', function() {
          authorizer.authorize(data, block);

          expect(block).to.have.been.calledWith('Authorization', 'Token employee_token="secret token!", employee_email="user@email.com"');
        });
      });
    });

    describe('when the session data does not contain a token', function() {
      beforeEach(function() {
        data = {
          email: 'user@email.com'
        };
      });

      itDoesNotAuthorizeTheRequest();
    });

    describe('when the session data does not contain an email', function() {
      beforeEach(function() {
        data = {
          token: 'secret token!'
        };
      });

      itDoesNotAuthorizeTheRequest();
    });
  });
});
