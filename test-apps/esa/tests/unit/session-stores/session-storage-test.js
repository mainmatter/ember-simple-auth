import { module } from 'qunit';
import SessionStorage from 'ember-simple-auth/session-stores/session-storage';
import itBehavesLikeAStore from './shared/store-behavior';
import itBehavesLikeAStorageEventHandler from './shared/storage-event-handler-behavior';

module('SessionStorageStore', function(hooks) {
  itBehavesLikeAStore({
    hooks,
    store() {
      return SessionStorage.create({
        _isFastBoot: false
      });
    }
  });

  itBehavesLikeAStorageEventHandler({
    hooks,
    store() {
      return SessionStorage.create({
        _isFastBoot: false
      });
    }
  });
});
