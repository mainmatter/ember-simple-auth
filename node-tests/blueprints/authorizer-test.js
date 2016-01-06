'use strict';

var EOL                = require('os').EOL;
var setupTestHooks     = require('ember-cli-blueprint-test-helpers/lib/helpers/setup');
var BlueprintHelpers   = require('ember-cli-blueprint-test-helpers/lib/helpers/blueprint-helper');
var generateAndDestroy = BlueprintHelpers.generateAndDestroy;

describe('Acceptance: ember generate and destroy authorizer', function() {
  setupTestHooks(this);
  
  it('generates an OAuth 2.0 authorizer', function() {
    return generateAndDestroy(['authorizer', 'application', '--base-class=oauth2'], {
      files: [
        { file: 'app/authorizers/application.js', contains: ['\
import OAuth2Bearer from \'ember-simple-auth/authorizers/oauth2-bearer\';' + EOL + '\
' + EOL + '\
export default OAuth2Bearer.extend({' + EOL + '\
});' + EOL + '\
']}
      ]
    });
  });

  it('generates a devise authorizer', function() {
    return generateAndDestroy(['authorizer', 'application', '--base-class=devise'], {
      files: [
        { file: 'app/authorizers/application.js', contains: ['\
import Devise from \'ember-simple-auth/authorizers/devise\';' + EOL + '\
' + EOL + '\
export default Devise.extend({' + EOL + '\
});' + EOL + '\
']}
      ]
    });
  });

  it('generates a generic authorizer', function() {
    return generateAndDestroy(['authorizer', 'application'], {
      files: [
        { file: 'app/authorizers/application.js', contains: ['\
import Base from \'ember-simple-auth/authorizers/base\';' + EOL + '\
' + EOL + '\
export default Base.extend({' + EOL + '\
  authorize(/*data, block*/) {' + EOL + '\
  }' + EOL + '\
});' + EOL + '\
']}
      ]
    });
  });

  it('throws when the authorizer is specified as its own base class', function() {
    return generateAndDestroy(['authorizer', 'application', '--base-class=application'], {
      throws: { 
        message: 'Authorizers cannot extend from themself. Remove the --base-class option or specify one of "oauth2" or "devise".',
        type: 'SilentError'
      }
    });
  });

  it('throws when an unknown base class is specified', function() {
    return generateAndDestroy(['authorizer', 'application', '--base-class=unknown'], {
      throws: { 
        message: 'The authorizer base class "unknown" is unknown. Remove the --base-class option or specify one of "oauth2" or "devise".',
        type: 'SilentError'
      }
    });
  });
});
