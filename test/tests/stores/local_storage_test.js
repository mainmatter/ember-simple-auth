import { LocalStorage } from 'ember-simple-auth/stores/local_storage';
import { itBehavesLikeAStore } from './shared/store_behavior';

describe('Stores.LocalStorage', function() {
  beforeEach(function() {
    this.store = LocalStorage.create();
    this.store.clear();
  });

  itBehavesLikeAStore();
});
