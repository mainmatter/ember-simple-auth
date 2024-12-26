import { module } from 'qunit';
import LocalStorage from 'ember-simple-auth/session-stores/local-storage';
import itBehavesLikeAStore from './shared/store-behavior';
import itBehavesLikeAStorageEventHandler from './shared/storage-event-handler-behavior';
import { setupTest } from 'ember-qunit';

class TestLocalStorage extends LocalStorage {
  _isFastBoot = false;
}

module('LocalStorageStore', function (hooks) {
  setupTest(hooks);

  itBehavesLikeAStore({
    hooks,
    store(_sinon, owner) {
      owner.register('session-store:local-storage', TestLocalStorage);
      return owner.lookup('session-store:local-storage');
    },
  });

  itBehavesLikeAStorageEventHandler({
    hooks,
    store(_sinon, owner) {
      owner.register('session-store:local-storage', TestLocalStorage);
      return owner.lookup('session-store:local-storage');
    },
  });
});
