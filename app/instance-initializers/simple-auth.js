import setupSessionRestoration from 'ember-simple-auth/instance-initializers/setup-session-restoration';
import setupAjaxPrefilter from 'ember-simple-auth/instance-initializers/setup-ajax-prefilter';

export default {
  name:       'simple-auth',
  initialize: function(instance) {
    setupSessionRestoration(instance);
    setupAjaxPrefilter(instance);
  }
};
