'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'test-app',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    contentSecurityPolicy: {
      'style-src': "'self' 'unsafe-inline'"
    },

    browserify: {
      tests: true
    },

    torii: {
      allowUnsafeRedirects: true,
      providers: {
        'facebook-oauth2': {
          apiKey: '631252926924840'
        }
      }
    },

    apiHost: 'http://localhost:4200',

    googleClientID: '694766332436-1g5bakjoo5flkfpv3t2mfsch9ghg7ggd.apps.googleusercontent.com',

    fastboot: {
      hostWhitelist: [/^localhost:\d+$/]
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // put production settings here
    ENV.fastboot = {
      hostWhitelist: ['demo.ember-simple-auth.com', 'esa-demo.herokuapp.com']
    };
    ENV.apiHost = 'https://demo-api.ember-simple-auth.com';
  }

  return ENV;
};
