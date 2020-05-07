import { describe } from 'mocha';
import Ephemeral from 'ember-simple-auth/session-stores/ephemeral';
import itBehavesLikeAStore from './shared/store-behavior';

describe('EphemeralStore', function() {
  itBehavesLikeAStore({
    store() {
      return Ephemeral.create();
    }
  });
});
