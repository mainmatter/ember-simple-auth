/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import Torii from 'ember-simple-auth/authenticators/torii';

const { RSVP } = Ember;

describe('ToriiAuthenticator', () => {
  let authenticator;
  let torii;

  beforeEach(() => {
    torii = {
      fetch() {},
      open() {},
      close() {}
    };
    authenticator = Torii.create({ torii });
  });

  describe('#restore', () => {
    function itDoesNotRestore(data) {
      it('returns a rejecting promise', () => {
        return authenticator.restore(data).catch(() => {
          expect(true).to.be.true;
        });
      });
    }

    it('throws if torii is not installed', () => {
      authenticator.set('torii', null);

      expect(() => {
        authenticator.authenticate();
      }).to.throw;
    });

    describe('when there is a torii provider in the session data', () => {
      describe('when torii fetches successfully', () => {
        beforeEach(() => {
          sinon.stub(torii, 'fetch').returns(RSVP.resolve({ some: 'other data' }));
        });

        it('returns a promise that resolves with the session data', () => {
          return authenticator.restore({ some: 'data', provider: 'provider' }).then((data) => {
            expect(data).to.eql({ some: 'other data', provider: 'provider' });
          });
        });
      });

      describe('when torii does not fetch successfully', () => {
        beforeEach(() => {
          sinon.stub(torii, 'fetch').returns(RSVP.reject());
        });

        itDoesNotRestore({ some: 'data', provider: 'provider' });
      });
    });

    describe('when there is no torii provider in the session data', () => {
      itDoesNotRestore();
    });
  });

  describe('#authenticate', () => {
    it('throws if torii is not installed', () => {
      authenticator.set('torii', null);

      expect(() => {
        authenticator.authenticate();
      }).to.throw;
    });

    describe('when torii opens successfully', () => {
      beforeEach(() => {
        sinon.stub(torii, 'open').returns(RSVP.resolve({ some: 'data' }));
      });

      it('returns a promise that resolves with the session data', () => {
        return authenticator.authenticate('provider').then((data) => {
          expect(data).to.eql({ some: 'data', provider: 'provider' });
        });
      });
    });

    describe('when torii does not open successfully', () => {
      beforeEach(() => {
        sinon.stub(torii, 'open').returns(RSVP.reject());
      });

      it('returns a rejecting promise', () => {
        return authenticator.authenticate('provider').catch(() => {
          expect(true).to.be.true;
        });
      });
    });
  });

  describe('#invalidate', () => {
    describe('when torii closes successfully', () => {
      beforeEach(() => {
        sinon.stub(torii, 'close').returns(RSVP.resolve());
      });

      it('returns a resolving promise', () => {
        return authenticator.invalidate({ some: 'data' }).then(() => {
          expect(true).to.be.true;
        });
      });
    });

    describe('when torii does not close successfully', () => {
      beforeEach(() => {
        sinon.stub(torii, 'close').returns(RSVP.reject());
      });

      it('returns a rejecting promise', () => {
        return authenticator.invalidate('provider').catch(() => {
          expect(true).to.be.true;
        });
      });
    });
  });
});
