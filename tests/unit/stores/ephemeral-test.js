import { describe, beforeEach } from 'mocha';
import Ephemeral from 'ember-simple-auth/stores/ephemeral';
import itBehavesLikeAStore from './shared/store-behavior';

let store;

describe('Stores.Ephemeral', function() {
  beforeEach(function() {
    store = Ephemeral.create();
  });

  itBehavesLikeAStore({
    store() {
      return store;
    }
  });
});
