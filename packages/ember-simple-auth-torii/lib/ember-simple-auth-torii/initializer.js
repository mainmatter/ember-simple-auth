var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import Authenticator from 'ember-simple-auth-torii/authenticators/torii';

export default {
  name:   'ember-simple-auth-torii',
  before: 'ember-simple-auth',
  initialize: function(container, application) {
    container.register('ember-simple-auth-authenticator:torii', Authenticator);
  }
};
