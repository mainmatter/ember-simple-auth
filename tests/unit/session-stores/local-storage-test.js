import { describe } from 'mocha';
import LocalStorage from 'ember-simple-auth/session-stores/local-storage';
import itBehavesLikeAStore from './shared/store-behavior';

describe('LocalStorageStore', function() {
  itBehavesLikeAStore({
    store() {
      return LocalStorage.create({
        _isFastBoot: false
      });
    }
  });
});
