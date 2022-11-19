import { module } from 'qunit';
import LocalStorage from 'ember-simple-auth/session-stores/local-storage';
import itBehavesLikeAStore from './shared/store-behavior';
import itBehavesLikeAStorageEventHandler from './shared/storage-event-handler-behavior';

module('LocalStorageStore', function(hooks) {
  itBehavesLikeAStore({
    hooks,
    store() {
      return LocalStorage.create({
        _isFastBoot: false
      });
    }
  });

  itBehavesLikeAStorageEventHandler({
    hooks,
    store() {
      return LocalStorage.create({
        _isFastBoot: false
      });
    }
  });
});
