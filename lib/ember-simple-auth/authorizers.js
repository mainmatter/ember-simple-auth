var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import { OAuth2 } from './authorizers/oauth2';

var Authorizers = Ember.Namespace.create({
  OAuth2: OAuth2
});

export { Authorizers };
