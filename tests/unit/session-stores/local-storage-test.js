import { describe, beforeEach, afterEach } from 'mocha';
import LocalStorage from 'ember-simple-auth/session-stores/local-storage';
import itBehavesLikeAStore from './shared/store-behavior';

describe('LocalStorageStore', () => {
  let store;

  beforeEach(() => {
    store = LocalStorage.create();
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
