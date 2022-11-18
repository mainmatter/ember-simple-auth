'use strict';

/* eslint-disable no-var, object-shorthand */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const { maybeEmbroider } = require('@embroider/test-setup');

var sourceTrees = [];

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    storeConfigInMeta: true,
    fingerprint: {
      generateAssetMap: EmberAddon.env() === 'production'
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
