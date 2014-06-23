var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import Authenticator from 'ember-simple-auth-oauth2/authenticators/oauth2';
import Authorizer    from 'ember-simple-auth-oauth2/authorizers/oauth2';

export default {
  name:       'ember-simple-auth-oauth2',
  before:     'ember-simple-auth',
  initialize: function(container, application) {
    container.register('ember-simple-auth-authorizer:oauth2-bearer', Authorizer);
    container.register('ember-simple-auth-authenticator:oauth2-password-grant', Authenticator);
  }
};
