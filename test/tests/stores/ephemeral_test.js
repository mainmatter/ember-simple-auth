import { Ephemeral } from 'ember-simple-auth/stores/ephemeral';
import { storeBehavior } from './common/store-behavior';

describe('Stores.Ephemeral', function() {
  beforeEach(function() {
    this.store = Ephemeral.create();
    this.store.clear();
  });

  storeBehavior();
});
