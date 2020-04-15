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
    sinon = sinonjs.createSandbox();
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
      it('returns a rejecting promise', async function() {
        try {
          await authenticator.restore(data);
          expect(false).to.be.true;
        } catch (_error) {
          expect(true).to.be.true;
        }
      });
    }

    it('throws if torii is not installed', async function() {
      authenticator.set('torii', null);

      try {
        await authenticator.restore();
        expect(false).to.be.true;
      } catch (_error) {
        expect(true).to.be.true;
      }
    });

    describe('when there is a torii provider in the session data', function() {
      describe('when torii fetches successfully', function() {
        beforeEach(function() {
          sinon.stub(torii, 'fetch').returns(RSVP.resolve({ some: 'other data' }));
        });

        it('returns a promise that resolves with the session data merged with the data fetched from torri', async function() {
          let data = await authenticator.restore({ some: 'data', provider: 'provider', another: 'prop' });

          expect(data).to.eql({ some: 'other data', provider: 'provider', another: 'prop' });
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
    it('throws if torii is not installed', async function() {
      authenticator.set('torii', null);

      try {
        await authenticator.authenticate();
        expect(false).to.be.true;
      } catch (_error) {
        expect(true).to.be.true;
      }
    });

    describe('when torii opens successfully', function() {
      beforeEach(function() {
        sinon.stub(torii, 'open').returns(RSVP.resolve({ some: 'data' }));
      });

      it('returns a promise that resolves with the session data', async function() {
        let data = await authenticator.authenticate('provider');

        expect(data).to.eql({ some: 'data', provider: 'provider' });
      });
    });

    describe('when torii does not open successfully', function() {
      beforeEach(function() {
        sinon.stub(torii, 'open').returns(RSVP.reject());
      });

      it('returns a rejecting promise', async function() {
        try {
          await authenticator.authenticate('provider');
          expect(false).to.be.true;
        } catch (_error) {
          expect(true).to.be.true;
        }
      });
    });
  });

  describe('#invalidate', function() {
    describe('when torii closes successfully', function() {
      beforeEach(function() {
        sinon.stub(torii, 'close').returns(RSVP.resolve());
      });

      it('returns a resolving promise', async function() {
        try {
          await authenticator.invalidate({ some: 'data' });
          expect(true).to.be.true;
        } catch (_error) {
          expect(false).to.be.true;
        }
      });
    });

    describe('when torii does not close successfully', function() {
      beforeEach(function() {
        sinon.stub(torii, 'close').returns(RSVP.reject());
      });

      it('returns a rejecting promise', async function() {
        try {
          await authenticator.invalidate({ some: 'data' });
          expect(false).to.be.true;
        } catch (_error) {
          expect(true).to.be.true;
        }
      });
    });
  });
});
