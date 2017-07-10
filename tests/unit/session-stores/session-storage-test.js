import { describe, beforeEach, afterEach } from 'mocha';
import SessionStorage from 'ember-simple-auth/session-stores/session-storage';
import itBehavesLikeAStore from './shared/store-behavior';

describe('SessionStorageStore', () => {
  let store;

  beforeEach(function() {
    store = SessionStorage.create({
      _isFastBoot: false
    });
  });

  afterEach(function() {
    store.clear();
  });

  itBehavesLikeAStore({
    store() {
      return store;
    }
  });
});
