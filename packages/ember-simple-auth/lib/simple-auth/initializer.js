import setup from './setup';
import getGlobalConfig from './utils/get-global-config';

export default {
  name:       'simple-auth',
  initialize: function(container, application) {
    var config = getGlobalConfig('simple-auth');
    Configuration.load(container, config);
    setup(container, application);
  }
};
