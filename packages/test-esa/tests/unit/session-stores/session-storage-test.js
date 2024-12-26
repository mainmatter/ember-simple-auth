import { module } from 'qunit';
import SessionStorage from 'ember-simple-auth/session-stores/session-storage';
import itBehavesLikeAStore from './shared/store-behavior';
import itBehavesLikeAStorageEventHandler from './shared/storage-event-handler-behavior';
import { setupTest } from 'ember-qunit';

class TestSessionStorage extends SessionStorage {
  _isFastBoot = false;
}

module('SessionStorageStore', function (hooks) {
  setupTest(hooks);

  itBehavesLikeAStore({
    hooks,
    store(_sinon, owner) {
      owner.register('session-store:session-storage', TestSessionStorage);
      return owner.lookup('session-store:session-storage');
    },
  });

  itBehavesLikeAStorageEventHandler({
    hooks,
    store(_sinon, owner) {
      owner.register('session-store:session-storage', TestSessionStorage);
      return owner.lookup('session-store:session-storage');
    },
  });
});
