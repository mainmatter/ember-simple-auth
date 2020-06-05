// see https://github.com/embermap/ember-cli-fastboot-testing/issues/104
import { beforeEach, afterEach } from 'mocha';
import { setupTest } from 'ember-mocha';
import { mockServer } from 'ember-cli-fastboot-testing/test-support';

export function setupFastbootTest() {
  setupTest();

  // eslint-disable-next-line mocha/no-top-level-hooks
  beforeEach(async function() {
    await mockServer.cleanUp();
  });

  // eslint-disable-next-line mocha/no-top-level-hooks
  afterEach(async function() {
    await mockServer.cleanUp();
  });
}
