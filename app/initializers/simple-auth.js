import Configuration from 'ember-simple-auth/configuration';
import getGlobalConfig from 'ember-simple-auth/utils/get-global-config';
import { register } from 'ember-simple-auth/setup';

export default {
  name:       'simple-auth',
  initialize: function(registry, application) {
    var config = getGlobalConfig('simple-auth');
    Configuration.load(config);
    register(application);
  }
};
