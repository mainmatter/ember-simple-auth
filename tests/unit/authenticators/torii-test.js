/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import Torii from 'ember-simple-auth/authenticators/torii';

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

      it('unsets the provider', () => {
        authenticator.provider = 'provider';

        return authenticator.restore(data).catch(() => {
          expect(authenticator.provider).to.be.null;
        });
      });
    }

    describe('when there is a torii provider in the session data', () => {
      describe('when torii fetches successfully', () => {
        beforeEach(() => {
          sinon.stub(torii, 'fetch').returns(Ember.RSVP.resolve({ some: 'other data' }));
        });

        it('returns a promise that resolves with the session data', () => {
          return authenticator.restore({ some: 'data', provider: 'provider' }).then((data) => {
            expect(data).to.eql({ some: 'other data', provider: 'provider' });
          });
        });

        it('remembers the provider', () => {
          return authenticator.restore({ some: 'data', provider: 'provider' }).then(() => {
            expect(authenticator.provider).to.eql('provider');
          });
        });
      });

      describe('when torii does not fetch successfully', () => {
        beforeEach(() => {
          sinon.stub(torii, 'fetch').returns(Ember.RSVP.reject());
        });

        itDoesNotRestore({ some: 'data', provider: 'provider' });
      });
    });

    describe('when there is no torii provider in the session data', () => {
      itDoesNotRestore();
    });
  });

  describe('#authenticate', () => {
    describe('when torii opens successfully', () => {
      beforeEach(() => {
        sinon.stub(torii, 'open').returns(Ember.RSVP.resolve({ some: 'data' }));
      });

      it('returns a promise that resolves with the session data', () => {
        return authenticator.authenticate('provider').then((data) => {
          expect(data).to.eql({ some: 'data', provider: 'provider' });
        });
      });

      it('remembers the provider', () => {
        return authenticator.authenticate('provider').then(() => {
          expect(authenticator.provider).to.eql('provider');
        });
      });
    });

    describe('when torii does not open successfully', () => {
      beforeEach(() => {
        sinon.stub(torii, 'open').returns(Ember.RSVP.reject());
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
        sinon.stub(torii, 'close').returns(Ember.RSVP.resolve());
      });

      it('returns a resolving promise', () => {
        return authenticator.invalidate({ some: 'data' }).then(() => {
          expect(true).to.be.true;
        });
      });

      it('unsets the provider', () => {
        authenticator.provider = 'provider';

        return authenticator.invalidate({ some: 'data' }).then(() => {
          expect(authenticator.provider).to.be.null;
        });
      });
    });

    describe('when torii does not close successfully', () => {
      beforeEach(() => {
        sinon.stub(torii, 'open').returns(Ember.RSVP.reject());
      });

      it('returns a rejecting promise', () => {
        return authenticator.invalidate('provider').catch(() => {
          expect(true).to.be.true;
        });
      });

      it('keeps the provider', () => {
        authenticator.provider = 'provider';

        return authenticator.invalidate({ some: 'data' }).catch(() => {
          expect(authenticator.provider).to.eql('provider');
        });
      });
    });
  });

});
