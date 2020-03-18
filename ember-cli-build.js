'use strict';

/* eslint-disable no-var, object-shorthand */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

var sourceTrees = [];

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    storeConfigInMeta: true,
    'ember-bootstrap': {
      bootstrapVersion: 4,
      importBootstrapFont: false,
      importBootstrapCSS: true
    },
    fingerprint: {
      generateAssetMap: EmberAddon.env() === 'production'
    },
    sourcemaps: {
      enabled: true,
      extensions: ['js']
    },
    'ember-cli-babel': {
      includePolyfill: true
    }
  });

  return app.toTree(sourceTrees);
};
