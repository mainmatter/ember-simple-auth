import { it } from 'ember-mocha';
import Ephemeral from 'simple-auth/stores/ephemeral';
import itBehavesLikeAStore from './shared/store-behavior';

describe('Stores.Ephemeral', function() {
  beforeEach(function() {
    this.store = Ephemeral.create();
  });

  itBehavesLikeAStore();
});
