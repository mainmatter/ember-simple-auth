import { describe, it } from 'mocha';
import { expect } from 'chai';
import { visit } from 'ember-cli-fastboot-testing/test-support';
import { setupFastbootTest } from '../helpers/fastboot';

describe('FastBoot: /', function() {
  setupFastbootTest();

  it('sets a session cookie on first visit', async function() {
    let { headers } = await visit('/');

    expect(headers['set-cookie']).to.deep.equal(['ember_simple_auth-session=%7B%22authenticated%22%3A%7B%7D%7D; path=/']);
  });
});
