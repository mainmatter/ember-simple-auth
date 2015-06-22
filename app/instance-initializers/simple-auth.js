import { inject } from 'ember-simple-auth/setup';

export default {
  name:       'simple-auth',
  initialize: function(instance) {
    let application = instance.container.lookup('application:main');
    inject(application);
  }
};
