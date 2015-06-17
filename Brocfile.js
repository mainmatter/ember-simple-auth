/* jshint node: true */
/* global require, module */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

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

module.exports = app.toTree();
