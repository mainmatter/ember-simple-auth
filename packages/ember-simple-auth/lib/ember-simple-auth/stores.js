import { Base } from './stores/base';
import { LocalStorage } from './stores/local_storage';
import { Ephemeral } from './stores/ephemeral';

var Stores = {
  Base:         Base,
  LocalStorage: LocalStorage,
  Ephemeral:    Ephemeral
};

var registerStores = function(container) {
  container.register('ember-simple-auth:session-stores:local-storage', LocalStorage);
  container.register('ember-simple-auth:session-stores:ephemeral', Ephemeral);
};

export { registerStores, Stores };
