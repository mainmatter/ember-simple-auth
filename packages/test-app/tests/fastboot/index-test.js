import { module, test } from 'qunit';
import { visit } from 'ember-cli-fastboot-testing/test-support';
import { setupFastbootTest } from '../helpers/fastboot';

module('FastBoot: /', function(hooks) {
  setupFastbootTest(hooks);

  test('sets a session cookie on first visit', async function(assert) {
    let { headers } = await visit('/');

    assert.deepEqual(headers['set-cookie'], ['ember_simple_auth-session=%7B%22authenticated%22%3A%7B%7D%7D; path=/']);
  });
});
