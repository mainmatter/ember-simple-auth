import { describe, beforeEach } from 'mocha';
import Ephemeral from 'ember-simple-auth/stores/ephemeral';
import itBehavesLikeAStore from './shared/store-behavior';

describe('EphemeralStore', () => {
  let store;

  beforeEach(() => {
    store = Ephemeral.create();
  });

  itBehavesLikeAStore({
    store() {
      return store;
    }
  });
});
