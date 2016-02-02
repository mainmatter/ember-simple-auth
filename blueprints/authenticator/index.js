var EOL = require('os').EOL;
var SilentError = require('silent-error');
var isPackageMissing = require('ember-cli-is-package-missing');

module.exports = {
  description: 'Generates an Ember Simple Auth authenticator',

  availableOptions: [
    { name: 'base-class', type: String, values: ['oauth2', 'devise', 'torii', 'base'], default: 'base' }
  ],

  locals: function(options) {
    var name      = options.entity.name;
    var baseClass = options.baseClass || 'base';

    if (baseClass === 'torii') {
      return {
        imports: 'import Ember from \'ember\';' + EOL + 'import Torii from \'ember-simple-auth/authenticators/torii\';',
        baseClass: 'Torii',
        body: EOL + '  torii: Ember.inject.service(\'torii\')'
      };
    } else if (baseClass === 'oauth2') {
      return {
        imports: 'import Ember from \'ember\';' + EOL + 'import OAuth2PasswordGrant from \'ember-simple-auth/authenticators/oauth2-password-grant\';',
        baseClass: 'OAuth2PasswordGrant',
        body: ''
      };
    } else if (baseClass === 'devise') {
      return {
        imports: 'import Ember from \'ember\';' + EOL + 'import Devise from \'ember-simple-auth/authenticators/devise\';',
        baseClass: 'Devise',
        body: ''
      };
    } else if (baseClass === 'base') {
      return {
        imports: 'import Ember from \'ember\';' + EOL + 'import Base from \'ember-simple-auth/authenticators/base\';',
        baseClass: 'Base',
        body: EOL + '  restore(data) {' + EOL + '  },' + EOL + EOL + '  authenticate(/*args*/) {' + EOL + '  },' + EOL + EOL + '  invalidate(data) {' + EOL + '  }'
      };
    } else if (name === baseClass) {
      throw new SilentError('Authenticators cannot extend from themself. Remove the --base-class option or specify one of "oauth2", "torii" or "devise".');
    } else {
      throw new SilentError('The authenticator base class "' + baseClass + '" is unknown. Remove the --base-class option or specify one of "oauth2", "torii" or "devise".');
    }
  },

  afterInstall: function(options) {
    if (!options.dryRun && options.torii && isPackageMissing(this, 'torii')) {
      return this.addPackagesToProject([
        { name: 'torii', target: '~0.6.1' }
      ]);
    }
  }
};
