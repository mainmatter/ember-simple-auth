'use strict';

/* eslint-disable no-var, object-shorthand */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
var Yuidoc = require('broccoli-yuidoc');
var version = require('git-repo-version')();

var sourceTrees = [];

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    storeConfigInMeta: true,
    'ember-bootstrap': {
      bootstrapVersion: 3,
      importBootstrapFont: false,
      importBootstrapCSS: true
    },
    fingerprint: {
      generateAssetMap: EmberAddon.env() === 'production'
    },
    sourcemaps: {
      enabled: true,
      extensions: ['js']
    }
  });

  var yuidocTree = new Yuidoc(['addon', 'app'], {
    destDir: 'docs',
    yuidoc: {
      project: {
        name: 'The Ember Simple Auth API',
        version: version
      },
      linkNatives: false,
      quiet: true,
      parseOnly: false,
      lint: false,
      themedir: 'docs/theme',
      helpers: ['docs/theme/helpers/helpers.js']
    }
  });

  if (app.env === 'production') {
    sourceTrees.push(yuidocTree);
  }

  return app.toTree(sourceTrees);
};
