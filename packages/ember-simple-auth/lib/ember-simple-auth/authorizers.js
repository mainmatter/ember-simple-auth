var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import { Base } from './authorizers/base';

var Authorizers = Ember.Namespace.create({
  Base: Base
});

export { Authorizers };
