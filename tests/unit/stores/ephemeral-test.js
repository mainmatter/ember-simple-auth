import { it } from 'ember-mocha';
import Ephemeral from 'ember-simple-auth/stores/ephemeral';
import itBehavesLikeAStore from './shared/store-behavior';

let store;

describe('Stores.Ephemeral', function() {
  beforeEach(function() {
    store = Ephemeral.create();
  });

  itBehavesLikeAStore({
    store: () => {
      return store;
    }
  });
});
