/* global require, module */
const EmberApp = require('ember-cli/lib/broccoli/ember-addon');
const yuidoc = require('broccoli-yuidoc');
const version = require('git-repo-version')();
const Handlebars = require('handlebars');
const mergeTrees = require('broccoli-merge-trees');
const merge = require('lodash/object/merge');

var sourceTrees = [];

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
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

  sourceTrees.push(app.toTree());

  const yuidocTree = yuidoc('addon', {
    srcDir: '/',
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
      helpers:     ['docs/theme/helpers/github-link.js'],
      themedir:    'docs/theme'
    }
  });

  if (app.env === 'production') {
    sourceTrees.push(yuidocTree);
  }

  return mergeTrees(sourceTrees);
};
