import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinonjs from 'sinon';
import OAuth2BearerAuthorizer from 'ember-simple-auth/authorizers/oauth2-bearer';
import { registerDeprecationHandler } from '@ember/debug';

describe('OAuth2BearerAuthorizer', () => {
  let sinon;
  let authorizer;
  let data;
  let block;

  beforeEach(function() {
    sinon = sinonjs.sandbox.create();
    block = sinon.spy();
  });

  afterEach(function() {
    sinon.restore();
  });

  it('shows deprecation warning from BaseAuthorizer', function() {
    let warnings;
    registerDeprecationHandler((message, options, next) => {
      // in case a deprecation is issued before a test is started
      if (!warnings) {
        warnings = [];
      }

      warnings.push(message);
      next(message, options);
    });
    authorizer = OAuth2BearerAuthorizer.create();

    expect(warnings[0]).to.eq('Ember Simple Auth: Authorizers are deprecated in favour of setting headers directly.');
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
