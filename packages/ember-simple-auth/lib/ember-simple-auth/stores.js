import { Base } from './stores/base';
import { LocalStorage } from './stores/local_storage';
import { Ephemeral } from './stores/ephemeral';

var Stores = {
  Base:         Base,
  LocalStorage: LocalStorage,
  Ephemeral:    Ephemeral
};

var registerStores = function(container) {
  container.register('session-store:local-storage', LocalStorage);
  container.register('session-store:ephemeral', Ephemeral);
};

export { registerStores, Stores };
