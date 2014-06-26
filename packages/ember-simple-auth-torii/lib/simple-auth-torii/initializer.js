var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import Authenticator from 'simple-auth-torii/authenticators/torii';

export default {
  name:   'simple-auth-torii',
  before: 'simple-auth',
  after:  'torii',
  initialize: function(container, application) {
    container.register('simple-auth-authenticator:torii', Authenticator);
  }
};
