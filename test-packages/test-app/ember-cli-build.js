'use strict';

/* eslint-disable no-var, object-shorthand */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { maybeEmbroider } = require('@embroider/test-setup');

var sourceTrees = [];

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    storeConfigInMeta: true,
    fingerprint: {
      generateAssetMap: EmberApp.env() === 'production'
    },
    sourcemaps: {
      enabled: true,
      extensions: ['js']
    },
    'ember-cli-babel': {
      includePolyfill: true
    },
    autoImport: {
      webpack: {
        resolve: {
          fallback: {
            util: false,
            process: false,
          }
        }
      }
    }
  });

  return maybeEmbroider(app);
};
