var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import { Base } from './stores/base';
import { LocalStorage } from './stores/local_storage';
import { Ephemeral } from './stores/ephemeral';

var Stores = Ember.Namespace.create({
  Base:         Base,
  LocalStorage: LocalStorage,
  Ephemeral:    Ephemeral
});

export { Stores };
