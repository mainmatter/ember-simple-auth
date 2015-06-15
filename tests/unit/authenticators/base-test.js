/* jshint expr:true */
import { it } from 'ember-mocha';
import Base from 'ember-simple-auth/authenticators/base';

let authenticator;

describe('Authenticators.Base', () => {
  beforeEach(() => {
    authenticator = Base.create();
  });

  describe('#restore', () => {
    it('returns a rejecting promise', (done) => {
      authenticator.restore().then(null, () => {
        expect(true).to.be.true;
        done();
      });
    });
  });

  describe('#authenticate', () => {
    it('returns a rejecting promise', (done) => {
      authenticator.authenticate().then(null, () => {
        expect(true).to.be.true;
        done();
      });
    });
  });

  describe('#invalidate', () => {
    it('returns a resolving promise', (done) => {
      authenticator.invalidate().then(() => {
        expect(true).to.be.true;
        done();
      });
    });
  });
});
