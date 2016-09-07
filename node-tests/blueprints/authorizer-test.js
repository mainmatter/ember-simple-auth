'use strict';

var EOL                = require('os').EOL;
var BlueprintHelpers   = require('ember-cli-blueprint-test-helpers/helpers');
var setupTestHooks     = BlueprintHelpers.setupTestHooks;
var emberNew           = BlueprintHelpers.emberNew;
var generateAndDestroy = BlueprintHelpers.emberGenerateDestroy;

var expect = require('ember-cli-blueprint-test-helpers/chai').expect;

describe('Acceptance: ember generate and destroy authorizer', function() {
  setupTestHooks(this);
  
  it('generates an OAuth 2.0 authorizer', function() {
    return emberNew().then(() => generateAndDestroy(['authorizer', 'application', '--base-class=oauth2'], (file) => {
      expect(file('app/authorizers/application.js')).to.contain('\
import OAuth2Bearer from \'ember-simple-auth/authorizers/oauth2-bearer\';' + EOL + '\
' + EOL + '\
export default OAuth2Bearer.extend({' + EOL + '\
});' + EOL + '\
');
    }));
  });

  it('generates a devise authorizer', function() {
    return emberNew().then(() => generateAndDestroy(['authorizer', 'application', '--base-class=devise'], (file) => {
      expect(file('app/authorizers/application.js')).to.contain('\
import Devise from \'ember-simple-auth/authorizers/devise\';' + EOL + '\
' + EOL + '\
export default Devise.extend({' + EOL + '\
});' + EOL + '\
');
    }));
  });

  it('generates a generic authorizer', function() {
    return emberNew().then(() => generateAndDestroy(['authorizer', 'application'], (file) => {
      expect(file('app/authorizers/application.js')).to.contain('\
import Base from \'ember-simple-auth/authorizers/base\';' + EOL + '\
' + EOL + '\
export default Base.extend({' + EOL + '\
  authorize(/*data, block*/) {' + EOL + '\
  }' + EOL + '\
});' + EOL + '\
');
    }));
  });

  it('throws when the authorizer is specified as its own base class', function() {
    return expect(emberNew().then(() => {
      return generateAndDestroy(['authorizer', 'application', '--base-class=application'])
    })).to.eventually.be.rejectedWith(
      'Authorizers cannot extend from themself. Remove the --base-class option or specify one of "oauth2" or "devise".'
    );
  });

  it('throws when an unknown base class is specified', function() {
    return expect(emberNew().then(() => {
      return generateAndDestroy(['authorizer', 'application', '--base-class=unknown'])
    })).to.eventually.be.rejectedWith(
      'The authorizer base class "unknown" is unknown. Remove the --base-class option or specify one of "oauth2" or "devise".'
    );
  });
});
