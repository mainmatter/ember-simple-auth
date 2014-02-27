var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import { Base } from './authorizers/base';
import { OAuth2 } from './authorizers/oauth2';

var Authorizers = Ember.Namespace.create({
  Base:   Base,
  OAuth2: OAuth2
});

export { Authorizers };
