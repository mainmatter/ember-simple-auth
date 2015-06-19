import Configuration from './configuration';
import getGlobalConfig from './utils/get-global-config';
import setup from './setup';

export default {
  name:       'simple-auth',
  initialize: function(registry, application) {
    if(registry.hasOwnProperty('lookup')) {
      var container = registry;
      var config = getGlobalConfig('simple-auth');
      Configuration.load(container, config);
      setup(container, application);
    }
  }
};
