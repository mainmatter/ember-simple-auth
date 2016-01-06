module.exports = {
  description: 'Generates an ember-simple-auth authorizer',

  availableOptions: [
    { name: 'devise', type: Boolean },
    { name: 'oauth2', type: Boolean },
    { name: 'base', type: Boolean }
  ],

  locals: function(options) {
    if (options.oauth2) {
      return {
        imports: 'import OAuth2Bearer from \'ember-simple-auth/authorizers/oauth2-bearer\';',
        baseClass: 'OAuth2Bearer'
      };
    } else if (options.devise) {
      return {
        imports: 'import Devise from \'ember-simple-auth/authorizers/devise\';',
        baseClass: 'Devise'
      };
    } else {
      return {
        imports: 'import BaseAuthorizer from \'ember-simple-auth/authorizers/base\';',
        baseClass: 'BaseAuthorizer'
      };
    }
  }
};
