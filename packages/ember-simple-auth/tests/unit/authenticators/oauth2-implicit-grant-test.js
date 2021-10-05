import { module, test } from 'qunit';
import OAuth2ImplicitGrant, { parseResponse } from 'ember-simple-auth/authenticators/oauth2-implicit-grant';
import { assert } from 'chai';

module('Unit | authenticators | oauth2-implicit-grant', function(hooks) {
  let authenticator;

  let data = {
    'access_token': 'secret-token'
  };

  hooks.beforeEach(function() {
    authenticator = OAuth2ImplicitGrant.create();
  });

  test('parseResponse - parses a URL into a data hash', function(assert) {
    let result = parseResponse('/routepath#access_token=secret-token&scope=something');

    assert.deepEqual(result, { access_token: 'secret-token', scope: 'something' });
  });

  test('parseResponse - parses a URL into a data hash when the app uses hash routing', function(assert) {
    let result = parseResponse('#/routepath#access_token=secret-token&scope=something');

    assert.deepEqual(result, { access_token: 'secret-token', scope: 'something' });
  });

  test('#restore - when the data contains an access_token - resolves with the correct data', async function(assert) {
    let _data = await authenticator.restore(data);

    assert.equal(_data, data);
  });

  test('#restore - when the data contains an access_token - when the data does not contain an access_token - returns a rejecting promise', async function(assert) {
    try {
      await authenticator.restore();
      assert.ok(false);
    } catch (error) {
      assert.equal(error, 'Could not restore session - "access_token" missing.');
    }
  });

  test('#authenticate - when the data contains an access_token - resolves with the correct data', async function(assert) {
    let _data = await authenticator.authenticate(data);

    assert.equal(_data, data);
  });

  test('#authenticate - when the data does not contain an access_token - rejects with an error', async function(assert) {
    try {
      await authenticator.authenticate({ foo: 'bar' });
      assert.ok(false);
    } catch (error) {
      assert.equal(error, 'Invalid auth params - "access_token" missing.');
    }
  });

  test('#authenticate - when the data contains an error - rejects with that error', async function(assert) {
    try {
      await authenticator.authenticate({ error: 'access_denied' });
      assert.ok(false);
    } catch (error) {
      assert.equal(error, 'access_denied');
    }
  });

  test('#invalidate - returns a resolving promise', async function(assert) {
    try {
      await authenticator.invalidate();
      assert.ok(true);
    } catch (_error) {
      assert.ok(false);
    }
  });
});
