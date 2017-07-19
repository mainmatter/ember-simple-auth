import { describe } from 'mocha';
import LocalStorage from 'ember-simple-auth/session-stores/local-storage';
import itBehavesLikeAStore from './shared/store-behavior';
import itBehavesLikeAStorageEventHandler from './shared/storage-event-handler-behavior';

describe('LocalStorageStore', function() {
  itBehavesLikeAStore({
    store() {
      return LocalStorage.create({
        _isFastBoot: false
      });
    }
  });

  itBehavesLikeAStorageEventHandler({
    store() {
      return LocalStorage.create({
        _isFastBoot: false
      });
    }
  });
});
