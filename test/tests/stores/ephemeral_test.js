import { Ephemeral } from 'ember-simple-auth/stores/ephemeral';
import { itBehavesLikeAStore } from './common/store_behavior';

describe('Stores.Ephemeral', function() {
  beforeEach(function() {
    this.store = Ephemeral.create();
    this.store.clear();
  });

  itBehavesLikeAStore();
});
