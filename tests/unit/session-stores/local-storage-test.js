import { describe, beforeEach, afterEach } from 'mocha';
import LocalStorage from 'ember-simple-auth/session-stores/local-storage';
import itBehavesLikeAStore from './shared/store-behavior';

describe('LocalStorageStore', () => {
  let store;

  beforeEach(() => {
    store = LocalStorage.create({
      _isFastBoot: false
    });
  });

  afterEach(() => {
    store.clear();
  });

  itBehavesLikeAStore({
    store() {
      return store;
    }
  });
});
