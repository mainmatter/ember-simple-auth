import setupSessionRestoration from 'ember-simple-auth/instance-initializers/setup-session-restoration';

export default {
  name:       'simple-auth',
  initialize: function(instance) {
    setupSessionRestoration(instance);
  }
};
