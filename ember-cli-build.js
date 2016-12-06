/* global require, module */
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const yuidoc = require('broccoli-yuidoc');
const version = require('git-repo-version')();
const Handlebars = require('handlebars');

var sourceTrees = [];

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    storeConfigInMeta: true,
    jscsOptions: {
      enabled: true,
      testGenerator: function(relativePath, errors) {
        if (errors) {
          errors = "\\n" + this.escapeErrorString(errors);
        } else {
          errors = "";
        }

        return "describe('JSCS - " + relativePath + "', function() {\n" +
          "it('should pass jscs', function() { \n" +
          "  expect(" + !errors + ", '" + relativePath + " should pass jscs." + errors + "').to.be.ok; \n" +
          "})});\n";
      }
    }
  });

  app.import('bower_components/bootstrap/dist/css/bootstrap.css');

  const yuidocTree = new yuidoc(['addon', 'app'], {
    destDir: 'docs',
    yuidoc: {
      project: {
        name:    'The Ember Simple Auth API',
        version: version,
      },
      linkNatives: false,
      quiet:       true,
      parseOnly:   false,
      lint:        false,
      themedir:    'docs/theme',
      helpers:     ['docs/theme/helpers/helpers.js']
    }
  });

  if (app.env === 'production') {
    sourceTrees.push(yuidocTree);
  }

  return app.toTree(sourceTrees);
};
