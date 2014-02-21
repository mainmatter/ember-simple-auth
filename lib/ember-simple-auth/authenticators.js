var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import { OAuth2 } from './authenticators/oauth2';

var Authenticators = Ember.Namespace.create({
  OAuth2: OAuth2
});

export { Authenticators };
