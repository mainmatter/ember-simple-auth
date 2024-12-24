import { module, test } from 'qunit';
import { run } from '@ember/runloop';
import sinonjs from 'sinon';
import { settled } from '@ember/test-helpers';

export default function (options) {
  let sinon;
  let store;
  let hooks = options.hooks;

  hooks.beforeEach(function () {
    sinon = sinonjs.createSandbox();
    store = options.store();
  });

  hooks.afterEach(function () {
    sinon.restore();
  });

  module('storage events', function (hooks) {
    hooks.beforeEach(function () {
      sinon.spy(window, 'addEventListener');
      sinon.spy(window, 'removeEventListener');
    });

    hooks.afterEach(function () {
      window.addEventListener.restore();
      window.removeEventListener.restore();
    });

    test('binds to "storage" events on the window when created', function (assert) {
      store = options.store();

      assert.ok(window.addEventListener.calledOnce);
    });

    test('triggers the "sessionDataUpdated" event when the data in the browser storage has changed', async function (assert) {
      let triggered = false;
      store.on('sessionDataUpdated', () => {
        triggered = true;
      });

      window.dispatchEvent(new StorageEvent('storage', { key: store.get('key') }));
      await settled();

      assert.ok(triggered);
    });

    test('does not trigger the "sessionDataUpdated" event when the data in the browser storage has not changed', async function (assert) {
      let triggered = false;
      store.on('sessionDataUpdated', () => {
        triggered = true;
      });

      store.persist({ key: 'value' }); // this data will be read again when the event is handled so that no change will be detected
      window.dispatchEvent(new StorageEvent('storage', { key: store.get('key') }));
      await settled();

      assert.notOk(triggered);
    });

    test('does not trigger the "sessionDataUpdated" event when the data in the browser storage has changed for a different key', async function (assert) {
      let triggered = false;
      store.on('sessionDataUpdated', () => {
        triggered = true;
      });

      window.dispatchEvent(new StorageEvent('storage', { key: 'another key' }));
      await settled();

      assert.notOk(triggered);
    });

    test('unbinds from "storage" events on the window when destroyed', function (assert) {
      run(() => store.destroy());

      assert.ok(window.removeEventListener.calledOnce);
    });
  });
}
