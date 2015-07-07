var marked = require('marked');
var Handlebars = require('handlebars');

module.exports = function(string) {
  return new Handlebars.SafeString(marked(string));
}
