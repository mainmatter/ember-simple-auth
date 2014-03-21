import { Base } from './stores/base';
import { LocalStorage } from './stores/local_storage';
import { Ephemeral } from './stores/ephemeral';

var Stores = {
  Base:         Base,
  LocalStorage: LocalStorage,
  Ephemeral:    Ephemeral
};

export { Stores };
