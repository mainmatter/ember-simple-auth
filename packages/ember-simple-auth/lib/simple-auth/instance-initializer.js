import Configuration from './configuration';
import getGlobalConfig from './utils/get-global-config';
import setup from './setup';

export default {
  name:       'simple-auth',
  initialize: function(application) {
    var config = getGlobalConfig('simple-auth');
    Configuration.load(application.container, config);
    setup(application.container, application);
  }
};
