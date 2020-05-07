import { describe } from 'mocha';
import SessionStorage from 'ember-simple-auth/session-stores/session-storage';
import itBehavesLikeAStore from './shared/store-behavior';
import itBehavesLikeAStorageEventHandler from './shared/storage-event-handler-behavior';

describe('SessionStorageStore', function() {
  itBehavesLikeAStore({
    store() {
      return SessionStorage.create({
        _isFastBoot: false
      });
    }
  });

  itBehavesLikeAStorageEventHandler({
    store() {
      return SessionStorage.create({
        _isFastBoot: false
      });
    }
  });
});
