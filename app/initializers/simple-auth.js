import Configuration from 'ember-simple-auth/configuration';
import getGlobalConfig from 'ember-simple-auth/utils/get-global-config';
import setupSession from 'ember-simple-auth/initializers/setup-session';
import setupSessionService from 'ember-simple-auth/initializers/setup-session-service';

export default {
  name:       'simple-auth',
  initialize: function(registry, application) {
    var config = getGlobalConfig('simple-auth');
    Configuration.load(config);
    setupSession(registry);
    setupSessionService(registry);
  }
};
