import Ember from 'ember';
import ENV from '../config/environment';
import Configuration from 'ember-simple-auth/configuration';
import setupSession from 'ember-simple-auth/initializers/setup-session';
import setupSessionService from 'ember-simple-auth/initializers/setup-session-service';

export default {
  name:       'ember-simple-auth',
  initialize: function(registry) {
    const config = ENV['ember-simple-auth'] || {};
    
    // We need to use the default Ember baseURL if one hasn't been set
    if (!(ENV['ember-simple-auth'] && ENV['ember-simple-auth'].baseURL)) {
      config.baseURL = ENV.baseURL;
    }
    
    Configuration.load(config);

    setupSession(registry);
    setupSessionService(registry);
  }
};
