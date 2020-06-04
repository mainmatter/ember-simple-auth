import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import OAuth2ImplicitGrant, { parseResponse } from 'ember-simple-auth/authenticators/oauth2-implicit-grant';

describe('OAuth2ImplicitGrantAuthenticator', () => {
  let authenticator;

  let data = {
    'access_token': 'secret-token'
  };

  beforeEach(function() {
    authenticator = OAuth2ImplicitGrant.create();
  });

  describe('parseResponse', function() {
    it('parses a URL into a data hash', function() {
      let result = parseResponse('/routepath#access_token=secret-token&scope=something');

      expect(result).to.deep.equal({ access_token: 'secret-token', scope: 'something' });
    });

    it('parses a URL into a data hash when the app uses hash routing', function() {
      let result = parseResponse('#/routepath#access_token=secret-token&scope=something');

      expect(result).to.deep.equal({ access_token: 'secret-token', scope: 'something' });
    });
  });

  describe('#restore', function() {
    describe('when the data contains an access_token', function() {
      it('resolves with the correct data', async function() {
        let _data = await authenticator.restore(data);

        expect(_data).to.eql(data);
      });

      describe('when the data does not contain an access_token', function() {
        it('returns a rejecting promise', async function() {
          try {
            await authenticator.restore();
            expect(false).to.be.true;
          } catch (error) {
            expect(error).to.eql('Could not restore session - "access_token" missing.');
          }
        });
      });
    });
  });

  describe('#authenticate', function() {
    describe('when the data contains an access_token', function() {
      it('resolves with the correct data', async function() {
        let _data = await authenticator.authenticate(data);

        expect(_data).to.eql(data);
      });
    });

    describe('when the data does not contain an access_token', function() {
      it('rejects with an error', async function() {
        try {
          await authenticator.authenticate({ foo: 'bar' });
          expect(false).to.be.true;
        } catch (error) {
          expect(error).to.eql('Invalid auth params - "access_token" missing.');
        }
      });
    });

    describe('when the data contains an error', function() {
      it('rejects with that error', async function() {
        try {
          await authenticator.authenticate({ error: 'access_denied' });
          expect(false).to.be.true;
        } catch (error) {
          expect(error).to.eql('access_denied');
        }
      });
    });
  });

  describe('#invalidate', function() {
    it('returns a resolving promise', async function() {
      try {
        await authenticator.invalidate();
        expect(true).to.be.true;
      } catch (_error) {
        expect(false).to.be.true;
      }
    });
  });
});
