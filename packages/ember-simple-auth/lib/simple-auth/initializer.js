import Configuration from './configuration';
import setup from './setup';

export default {
  name:       'simple-auth',
  initialize: function(container, application) {
    Configuration.load(container);
    setup(container, application);
  }
};
