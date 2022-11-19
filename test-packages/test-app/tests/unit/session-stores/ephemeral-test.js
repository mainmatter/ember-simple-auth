import { module } from 'qunit';
import Ephemeral from 'ember-simple-auth/session-stores/ephemeral';
import itBehavesLikeAStore from './shared/store-behavior';

module('EphemeralStore', function(hooks) {
  itBehavesLikeAStore({
    hooks,
    store() {
      return Ephemeral.create();
    }
  });
});
