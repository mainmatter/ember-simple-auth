var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import { Base } from './authenticators/base';
import { OAuth2 } from './authenticators/oauth2';

var Authenticators = Ember.Namespace.create({
  Base:   Base,
  OAuth2: OAuth2
});

export { Authenticators };
