'use strict';

var EOL                = require('os').EOL;
var setupTestHooks     = require('ember-cli-blueprint-test-helpers/lib/helpers/setup');
var BlueprintHelpers   = require('ember-cli-blueprint-test-helpers/lib/helpers/blueprint-helper');
var generateAndDestroy = BlueprintHelpers.generateAndDestroy;

describe('Acceptance: ember generate and destroy authenticator', function() {
  setupTestHooks(this);
  
  it('generates a torii authenticator', function() {
    debugger;
    return generateAndDestroy(['authenticator', 'application', '--base-class=torii'], {
      files: [
        { file: 'app/authenticators/application.js', contains: ['\
import Ember from \'ember\';' + EOL + '\
import Torii from \'ember-simple-auth/authenticators/torii\';' + EOL + '\
' + EOL + '\
export default Torii.extend({' + EOL + '\
  torii: Ember.inject.service(\'torii\')' + EOL + '\
});' + EOL + '\
']}
      ]
    }).then(function() { debugger; }, function() { debugger; });
  });

  it('generates an OAuth 2.0 authenticator', function() {
    return generateAndDestroy(['authenticator', 'application', '--base-class=oauth2'], {
      files: [
        { file: 'app/authenticators/application.js', contains: ['\
import Ember from \'ember\';' + EOL + '\
import OAuth2PasswordGrant from \'ember-simple-auth/authenticators/oauth2-password-grant\';' + EOL + '\
' + EOL + '\
export default OAuth2PasswordGrant.extend({' + EOL + '\
});' + EOL + '\
']}
      ]
    });
  });

  it('generates a devise authenticator', function() {
    return generateAndDestroy(['authenticator', 'application', '--base-class=devise'], {
      files: [
        { file: 'app/authenticators/application.js', contains: ['\
import Ember from \'ember\';' + EOL + '\
import Devise from \'ember-simple-auth/authenticators/devise\';' + EOL + '\
' + EOL + '\
export default Devise.extend({' + EOL + '\
});' + EOL + '\
']}
      ]
    });
  });

  it('generates a generic authenticator', function() {
    return generateAndDestroy(['authenticator', 'application'], {
      files: [
        { file: 'app/authenticators/application.js', contains: ['\
import Ember from \'ember\';' + EOL + '\
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
']}
      ]
    });
  });

  it('throws when the authenticator is specified as its own base class', function() {
    return generateAndDestroy(['authenticator', 'application', '--base-class=application'], {
      throws: { 
        message: 'Authenticators cannot extend from themself. Remove the --base-class option or specify one of "oauth2", "torii" or "devise".',
        type: 'SilentError'
      }
    });
  });

  it('throws when an unknown base class is specified', function() {
    return generateAndDestroy(['authenticator', 'application', '--base-class=unknown'], {
      throws: { 
        message: 'The authenticator base class "unknown" is unknown. Remove the --base-class option or specify one of "oauth2", "torii" or "devise".',
        type: 'SilentError'
      }
    });
  });
});
