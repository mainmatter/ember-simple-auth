var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import { Base } from './stores/base';
import { Cookie } from './stores/cookie';
import { LocalStorage } from './stores/local_storage';
import { Ephemeral } from './stores/ephemeral';

var Stores = Ember.Namespace.create({
  Base:         Base,
  Cookie:       Cookie,
  LocalStorage: LocalStorage,
  Ephemeral:    Ephemeral
});

export { Stores };
