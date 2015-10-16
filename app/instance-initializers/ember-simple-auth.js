import setupSessionRestoration from 'ember-simple-auth/instance-initializers/setup-session-restoration';

export default {
  name:       'ember-simple-auth',
  initialize: function(instance) {
    setupSessionRestoration(instance);
  }
};
