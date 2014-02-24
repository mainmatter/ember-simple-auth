import { Base } from 'ember-simple-auth/authenticators/base';

var authenticator;

module('Authenticators.Base', {
  setup: function() {
    authenticator = Base.create();
  }
});

test('does not restore the session', function() {
  var rejected;
  Ember.run(function() {
    authenticator.restore({}).then(function() {}, function() {
      rejected = true;
    });
  });

  ok(rejected, 'Authenticators.Base returns a rejecting promise for session restoration.');
});

test('invalidates the session', function() {
  var resolved;
  Ember.run(function() {
    authenticator.invalidate().then(function() {
      resolved = true;
    });
  });

  ok(resolved, 'Authenticators.Base returns a resolving promise for session invalidation.');
});
