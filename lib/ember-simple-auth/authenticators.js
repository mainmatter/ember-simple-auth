var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import { OAuth2 } from './authenticartors/oauth2';

var Authenticators = Ember.Namespaces.create({
  OAuth2: OAuth2
});

export { Authenticators };
