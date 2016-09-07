'use strict';

var EOL                = require('os').EOL;
var BlueprintHelpers   = require('ember-cli-blueprint-test-helpers/helpers');
var setupTestHooks     = BlueprintHelpers.setupTestHooks;
var emberNew           = BlueprintHelpers.emberNew;
var generateAndDestroy = BlueprintHelpers.emberGenerateDestroy;

var expect = require('ember-cli-blueprint-test-helpers/chai').expect;

describe('Acceptance: ember generate and destroy authenticator', function() {
  setupTestHooks(this);

  it('generates a torii authenticator', function() {
    return emberNew().then(() => generateAndDestroy(['authenticator', 'application', '--base-class=torii'], (file) => {
      expect(file('app/authenticators/application.js')).to.contain('\
import Torii from \'ember-simple-auth/authenticators/torii\';' + EOL + '\
' + EOL + '\
export default Torii.extend({' + EOL + '\
  torii: Ember.inject.service(\'torii\')' + EOL + '\
});' + EOL + '\
');
    }));
  });

  it('generates an OAuth 2.0 authenticator', function() {
    return emberNew().then(() => generateAndDestroy(['authenticator', 'application', '--base-class=oauth2'], (file) => {
      expect(file('app/authenticators/application.js')).to.contain('\
import OAuth2PasswordGrant from \'ember-simple-auth/authenticators/oauth2-password-grant\';' + EOL + '\
' + EOL + '\
export default OAuth2PasswordGrant.extend({' + EOL + '\
});' + EOL + '\
');
    }));
  });

  it('generates a devise authenticator', function() {
    return emberNew().then(() => generateAndDestroy(['authenticator', 'application', '--base-class=devise'], (file) => {
      expect(file('app/authenticators/application.js')).to.contain('\
import Devise from \'ember-simple-auth/authenticators/devise\';' + EOL + '\
' + EOL + '\
export default Devise.extend({' + EOL + '\
});' + EOL + '\
');
    }));
  });

  it('generates a generic authenticator', function() {
    return emberNew().then(() => generateAndDestroy(['authenticator', 'application'], (file) => {
      expect(file('app/authenticators/application.js')).to.contain('\
import Base from \'ember-simple-auth/authenticators/base\';' + EOL + '\
' + EOL + '\
export default Base.extend({' + EOL + '\
  restore(data) {' + EOL + '\
  },' + EOL + '\
' + EOL + '\
  authenticate(/*args*/) {' + EOL + '\
  },' + EOL + '\
' + EOL + '\
  invalidate(data) {' + EOL + '\
  }' + EOL + '\
});' + EOL + '\
');
    }));
  });

  it('throws when the authenticator is specified as its own base class', function() {
    return expect(emberNew().then(() => {
      return generateAndDestroy(['authenticator', 'application', '--base-class=application'])
    })).to.eventually.be.rejectedWith(
      'Authenticators cannot extend from themself. Remove the --base-class option or specify one of "oauth2", "torii" or "devise".'
    );
  });

  it('throws when an unknown base class is specified', function() {
    return expect(emberNew().then(() => {
      return generateAndDestroy(['authenticator', 'application', '--base-class=unknown'])
    })).to.eventually.be.rejectedWith(
      'The authenticator base class "unknown" is unknown. Remove the --base-class option or specify one of "oauth2", "torii" or "devise".'
    );
  });
});
