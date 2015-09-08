/* global require, module */
const EmberApp = require('ember-cli/lib/broccoli/ember-addon');
const yuidoc = require('broccoli-yuidoc');
const Handlebars = require('handlebars');
const mergeTrees = require('broccoli-merge-trees');
const broccoliHandlebars = require('broccoli-handlebars');
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
      parseOnly: true
    }
  });

  const compiledDocsTree = broccoliHandlebars('docs/theme', ['index.hbs'], {
    handlebars: Handlebars,
    helpers: require('./docs/theme/helpers'),
    partials: 'docs/theme/partials',
    context: function() {
      return merge(
        {},
        require('./docs/config.json'),
        require('./tmp/docs/data.json')
      );
    },
    destFile: function() {
      return 'docs/index.html';
    }
  });

  if (app.env === 'production') {
    sourceTrees.push(yuidocTree);
    sourceTrees.push(compiledDocsTree);
  }

  return mergeTrees(sourceTrees);
};
