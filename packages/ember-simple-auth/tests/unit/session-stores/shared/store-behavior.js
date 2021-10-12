import { module, test } from 'qunit';
import { next, run } from '@ember/runloop';
import sinonjs from 'sinon';

export default function(options) {
  let syncExternalChanges = options.syncExternalChanges || function() { };
  let sinon;
  let hooks = options.hooks;

  // eslint-disable-next-line mocha/no-top-level-hooks
  hooks.beforeEach(function() {
    sinon = sinonjs.createSandbox();
  });

  // eslint-disable-next-line mocha/no-top-level-hooks
  hooks.afterEach(function() {
    sinon.restore();
  });

  module('#persist', function(hooks) {
    let store;
    hooks.beforeEach(function() {
      store = options.store(sinon, this.owner);
    });

    test('persists an object', async function(assert) {
      await store.persist({ key: 'value' });
      let restoredContent = await store.restore();

      assert.deepEqual(restoredContent, { key: 'value' });
    });

    test('overrides existing data', async function(assert) {
      await store.persist({ key: 'value' });
      await store.persist({ key1: 'value1' });
      await store.persist({ key2: 'value2' });
      let restoredContent = await store.restore();

      assert.deepEqual(restoredContent, { key2: 'value2' });
    });

    test('does not trigger the "sessionDataUpdated" event', async function(assert) {
      let triggered = false;
      store.one('sessionDataUpdated', () => (triggered = true));
      store.persist({ key: 'other value' });
      syncExternalChanges(store);

      await new Promise(resolve => {
        next(() => {
          assert.notOk(triggered);
          resolve();
        });
      });
    });
  });

  module('#restore', function(hooks) {
    module('when the store is empty', function(hooks) {
      test('returns an empty object', async function(assert) {
        let store;
        run(() => {
          store = options.store(sinon, this.owner);
        });
        await store.clear();
        let restoredContent = await store.restore();

        assert.deepEqual(restoredContent, {});
      });
    });

    module('when the store has data', function(hooks) {
      let store;
      hooks.beforeEach(function() {
        store = options.store(sinon, this.owner);
        return store.persist({ key1: 'value1', key2: 'value2' });
      });

      test('returns all data in the store', async function(assert) {
        let restoredContent = await store.restore();

        assert.deepEqual(restoredContent, { key1: 'value1', key2: 'value2' });
      });

      test('returns a copy of the stored data', async function(assert) {
        let data = await store.restore();
        data.key1 = 'another value!';
        let restoredContent = await store.restore();

        assert.deepEqual(restoredContent, { key1: 'value1', key2: 'value2' });
      });
    });
  });

  module('#clear', function(hooks) {
    test('empties the store', async function(assert) {
      let store;
      run(() => {
        store = options.store(sinon, this.owner);
      });
      await store.persist({ key1: 'value1', key2: 'value2' });
      await store.clear();
      let restoredContent = await store.restore();

      assert.deepEqual(restoredContent, {});
    });
  });
}
