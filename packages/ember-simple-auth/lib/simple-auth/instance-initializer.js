import Configuration from './configuration';
import getGlobalConfig from './utils/get-global-config';
import setup from './setup';

export default {
  name: 'simple-auth',
  initialize: function(instance) {
    var container = instance.container;
    var config = getGlobalConfig('simple-auth');
    Configuration.load(container, config);
    setup(container, instance);
  }
};
