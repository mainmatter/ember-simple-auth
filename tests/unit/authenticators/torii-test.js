import RSVP from 'rsvp';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinonjs from 'sinon';
import Torii from 'ember-simple-auth/authenticators/torii';

describe('ToriiAuthenticator', () => {
  let sinon;
  let authenticator;
  let torii;

  beforeEach(function() {
    sinon = sinonjs.sandbox.create();
    torii = {
      fetch() {},
      open() {},
      close() {}
    };
    authenticator = Torii.create({ torii });
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('#restore', function() {
    function itDoesNotRestore(data) {
      it('returns a rejecting promise', function() {
        return authenticator.restore(data).then(
          () => {
            expect(false).to.be.true;
          },
          () => {
            expect(true).to.be.true;
          }
        );
      });
    }

    it('throws if torii is not installed', function() {
      authenticator.set('torii', null);

      expect(() => {
        authenticator.authenticate();
      }).to.throw;
    });

    describe('when there is a torii provider in the session data', function() {
      describe('when torii fetches successfully', function() {
        beforeEach(function() {
          sinon.stub(torii, 'fetch').returns(RSVP.resolve({ some: 'other data' }));
        });

        it('returns a promise that resolves with the session data merged with the data fetched from torri', function() {
          return authenticator.restore({ some: 'data', provider: 'provider', another: 'prop' }).then((data) => {
            expect(data).to.eql({ some: 'other data', provider: 'provider', another: 'prop' });
          });
        });
      });

      describe('when torii does not fetch successfully', function() {
        beforeEach(function() {
          sinon.stub(torii, 'fetch').returns(RSVP.reject());
        });

        itDoesNotRestore({ some: 'data', provider: 'provider' });
      });
    });

    describe('when there is no torii provider in the session data', function() {
      itDoesNotRestore();
    });
  });

  describe('#authenticate', function() {
    it('throws if torii is not installed', function() {
      authenticator.set('torii', null);

      expect(() => {
        authenticator.authenticate();
      }).to.throw;
    });

    describe('when torii opens successfully', function() {
      beforeEach(function() {
        sinon.stub(torii, 'open').returns(RSVP.resolve({ some: 'data' }));
      });

      it('returns a promise that resolves with the session data', function() {
        return authenticator.authenticate('provider').then((data) => {
          expect(data).to.eql({ some: 'data', provider: 'provider' });
        });
      });
    });

    describe('when torii does not open successfully', function() {
      beforeEach(function() {
        sinon.stub(torii, 'open').returns(RSVP.reject());
      });

      it('returns a rejecting promise', function() {
        return authenticator.authenticate('provider').catch(() => {
          expect(true).to.be.true;
        });
      });
    });
  });

  describe('#invalidate', function() {
    describe('when torii closes successfully', function() {
      beforeEach(function() {
        sinon.stub(torii, 'close').returns(RSVP.resolve());
      });

      it('returns a resolving promise', function() {
        return authenticator.invalidate({ some: 'data' }).then(() => {
          expect(true).to.be.true;
        });
      });
    });

    describe('when torii does not close successfully', function() {
      beforeEach(function() {
        sinon.stub(torii, 'close').returns(RSVP.reject());
      });

      it('returns a rejecting promise', function() {
        return authenticator.invalidate('provider').catch(() => {
          expect(true).to.be.true;
        });
      });
    });
  });
});
