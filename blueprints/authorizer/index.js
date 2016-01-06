var EOL = require('os').EOL;
var SilentError = require('silent-error');

module.exports = {
  description: 'Generates an Ember Simple Auth authorizer',

  availableOptions: [
    { name: 'base-class', type: String, values: ['oauth2', 'devise', 'base'], default: 'base' }
  ],

  locals: function(options) {
    var name      = options.entity.name;
    var baseClass = options.baseClass || 'base';

    if (baseClass === 'oauth2') {
      return {
        imports: 'import OAuth2Bearer from \'ember-simple-auth/authorizers/oauth2-bearer\';',
        baseClass: 'OAuth2Bearer',
        body: ''
      };
    } else if (baseClass === 'devise') {
      return {
        imports: 'import Devise from \'ember-simple-auth/authorizers/devise\';',
        baseClass: 'Devise',
        body: ''
      };
    } else if (baseClass === 'base') {
      return {
        imports: 'import Base from \'ember-simple-auth/authorizers/base\';',
        baseClass: 'Base',
        body: EOL + '  authorize(/*data, block*/) {' + EOL + '  }'
      };
    } else if (name === baseClass) {
      throw new SilentError('Authorizers cannot extend from themself. Remove the --base-class option or specify one of "oauth2" or "devise".');
    } else {
      throw new SilentError('The authorizer base class "' + baseClass + '" is unknown. Remove the --base-class option or specify one of "oauth2" or "devise".');
    }
  }
};
