/* eslint-env node */
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const Yuidoc = require('broccoli-yuidoc');
const version = require('git-repo-version')();

let sourceTrees = [];

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    storeConfigInMeta: true,
  });

  app.import('bower_components/bootstrap/dist/css/bootstrap.css');

  const yuidocTree = new Yuidoc(['addon', 'app'], {
    destDir: 'docs',
    yuidoc: {
      project: {
        name: 'The Ember Simple Auth API',
        version,
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
