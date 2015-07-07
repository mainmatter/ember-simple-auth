/* jshint node: true */
/* global require, module */

const Handlebars = require('handlebars'),
  mergeTrees = require('broccoli-merge-trees'),
  broccoliHandlebars = require('broccoli-handlebars'),
  merge = require('lodash/object/merge');

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const sourceTrees = [];

var app = new EmberAddon({
  jscsOptions: {
    enabled: true,
    testGenerator: function(relativePath, errors) {
      if (errors) {
        errors = "\\n" + this.escapeErrorString(errors);
      } else {
        errors = "";
      }

      return "describe('JSCS - " + relativePath + "', function(){\n" +
        "it('should pass jscs', function() { \n" +
        "  expect(" + !errors + ", '" + relativePath + " should pass jscs." + errors + "').to.be.ok; \n" +
        "})});\n";
    }
  }
});

app.import('bower_components/bootstrap/dist/css/bootstrap.css');

sourceTrees.push(app.toTree());

// Docs
if (app.env === 'docs') {
  const docs = broccoliHandlebars('docs/theme', ['index.hbs'], {
    handlebars: Handlebars,
    helpers: require('./docs/theme/helpers'),
    partials: 'docs/theme/partials',
    context: function() {
      return merge(
        {},
        require('./docs/config.json'),
        require('./tmp/docs/data.json')
      )
    },
    destFile: function (filename) {
      return 'docs/' + filename.replace(/(hbs|handlebars)$/, 'html');
    }
  });

  sourceTrees.push(docs);
}

module.exports = mergeTrees(sourceTrees);