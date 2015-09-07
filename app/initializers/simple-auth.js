import ENV from '../config/environment';
import Configuration from 'ember-simple-auth/configuration';
import setupSessionStores from 'ember-simple-auth/initializers/setup-session-stores';
import setupSession from 'ember-simple-auth/initializers/setup-session';
import setupSessionService from 'ember-simple-auth/initializers/setup-session-service';
import setupAuthorizers from 'ember-simple-auth/initializers/setup-authorizers';

export default {
  name:       'ember-simple-auth',
  initialize: function(registry, application) {
    var config = ENV['ember-simple-auth'];
    Configuration.load(config);
    setupSessionStores(registry);
    setupSession(registry);
    setupSessionService(registry);
    setupAuthorizers(registry);
  }
};
