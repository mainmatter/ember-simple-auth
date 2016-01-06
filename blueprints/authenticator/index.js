var EOL = require('os').EOL;

module.exports = {
  description: 'Generates an ember-simple-auth authenticator',

  availableOptions: [
    { name: 'torii', type: Boolean },
    { name: 'devise', type: Boolean },
    { name: 'oauth2', type: Boolean },
    { name: 'base', type: Boolean }
  ],

  locals: function(options) {
    if (options.torii) {
      return {
        imports: 'import Ember from \'ember\';' + EOL + 'import Torii from \'ember-simple-auth/authenticators/torii\';',
        baseClass: 'Torii',
        properties: 'torii: Ember.inject.service(\'torii\'),' + EOL
      };
    } else if (options.oauth2) {
      return {
        imports: 'import Ember from \'ember\';' + EOL + 'import OAuth2PasswordGrant from \'ember-simple-auth/authenticators/oauth2-password-grant\';',
        baseClass: 'OAuth2PasswordGrant',
        properties: 'serverTokenRevocationEndpoint: \'/revoke\',' + EOL
      };
    } else if (options.devise) {
      return {
        imports: 'import Ember from \'ember\';' + EOL + 'import Devise from \'ember-simple-auth/authenticators/devise\';',
        baseClass: 'Devise',
        properties: ''
      };
    } else {
      return {
        imports: 'import Ember from \'ember\';' + EOL + 'import BaseAuthenticator from \'ember-simple-auth/authenticators/base\';',
        baseClass: 'BaseAuthenticator',
        properties: ''
      };
    }
  }
};
