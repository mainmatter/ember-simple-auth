import Session from './session';
import LocalStorage from './stores/local-storage';
import Ephemeral from './stores/ephemeral';

import getGlobalConfig from './utils/get-global-config';
import Configuration from './configuration';

export default {
  name: "simple-auth",
  initialize: function(_, application){
    // load the default config without the container
    var config = getGlobalConfig('simple-auth');
    Configuration.load(config);

    application.register('simple-auth-session-store:local-storage', LocalStorage);
    application.register('simple-auth-session-store:ephemeral', Ephemeral);
    application.register('simple-auth-session:main', Session);

    // only inject stuff here.
    Ember.A(['controller', 'route', 'component']).forEach(function(component) {
      application.inject(component, Configuration.sessionPropertyName, Configuration.session);
    });
  }
};
