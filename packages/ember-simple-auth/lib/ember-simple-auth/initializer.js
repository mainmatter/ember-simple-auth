var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import setup from './setup';

export default {
  name:       'ember-simple-auth',
  initialize: function(container, application) {
    setup(container, application);
  }
};
