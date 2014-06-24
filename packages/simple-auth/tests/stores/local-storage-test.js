import LocalStorage from 'simple-auth/stores/local-storage';
import itBehavesLikeAStore from './shared/store-behavior';

describe('Stores.LocalStorage', function() {
  beforeEach(function() {
    this.store = LocalStorage.create();
    this.store.clear();
  });

  itBehavesLikeAStore();
});
