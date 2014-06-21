var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import Store from 'ember-simple-auth-cookie-store/stores/cookie';

export default {
  name:       'ember-simple-auth-cookie-store',
  before:     'ember-simple-auth',
  initialize: function(container, application) {
    container.register('ember-simple-auth-session-store:cookie', Store);
  }
};
