import Configuration from 'ember-simple-auth/configuration';
import getGlobalConfig from 'ember-simple-auth/utils/get-global-config';
import setup from 'ember-simple-auth/setup';

export default {
  name:       'simple-auth',
  initialize: function(container, application) {
    var config = getGlobalConfig('simple-auth');
    Configuration.load(container, config);
    setup(container, application);
  }
};
