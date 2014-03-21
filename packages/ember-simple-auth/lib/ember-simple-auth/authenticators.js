var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import { Base } from './authenticators/base';

var Authenticators = Ember.Namespace.create({
  Base: Base
});

export { Authenticators };
