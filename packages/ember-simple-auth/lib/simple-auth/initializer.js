var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import TestAuthenticator from 'simple-auth/authenticators/test';
import setup from './setup';

export default {
  name:       'simple-auth',
  initialize: function(container, application) {
    setup(container, application);
    if (Ember.testing) {
      container.register('simple-auth-authenticator:test', TestAuthenticator);
    }
  }
};
