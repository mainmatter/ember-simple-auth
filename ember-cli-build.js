/* eslint-env node */
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const Yuidoc = require('broccoli-yuidoc');
const version = require('git-repo-version')();

let sourceTrees = [];

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    storeConfigInMeta: true,
    jscsOptions: {
      enabled: true,
      testGenerator(relativePath, errors) {
        if (errors) {
          errors = `\\n${this.escapeErrorString(errors)}`;
        } else {
          errors = '';
        }

        return `describe('JSCS - ${relativePath}', function() {
  it('should pass jscs', function() {
    expect(${!errors}, '${relativePath} should pass jscs.${errors}').to.be.ok; 
  });
});`;
      }
    }
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
