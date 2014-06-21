var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import Authenticator from 'ember-simple-auth-devise/authenticators/devise';
import Authorizer    from 'ember-simple-auth-devise/authorizers/devise';

export default {
  name:       'ember-simple-auth-devise',
  before:     'ember-simple-auth',
  initialize: function(container, application) {
    container.register('ember-simple-auth-authorizer:devise', Authorizer);
    container.register('ember-simple-auth-authenticator:devise', Authenticator);
  }
};
