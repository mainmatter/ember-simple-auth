var marked = require('../vendor/marked');

module.exports = function(string) {
  return new Handlebars.SafeString(marked(srting));
}
