import { setupTest } from 'ember-qunit';
// see https://github.com/embermap/ember-cli-fastboot-testing/issues/104
import { mockServer } from 'ember-cli-fastboot-testing/test-support';

export function setupFastbootTest(hooks) {
  setupTest(hooks);

  hooks.beforeEach(async function() {
    await mockServer.cleanUp();
  });

  hooks.afterEach(async function() {
    await mockServer.cleanUp();
  });
}
