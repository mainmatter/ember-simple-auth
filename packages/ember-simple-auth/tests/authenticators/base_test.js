var authenticator;

module('Ember.SimpleAuth.Authenticators.Base', {
  setup: function() {
    authenticator = Ember.SimpleAuth.Authenticators.Base.create();
  }
});

test('does not restore the session', function() {
  var rejected;
  Ember.run(function() {
    authenticator.restore({}).then(function() {}, function() {
      rejected = true;
    });
  });

  ok(rejected, 'Ember.SimpleAuth.Authenticators.Base returns a rejecting promise for session restoration.');
});

test('invalidates the session', function() {
  var resolved;
  Ember.run(function() {
    authenticator.invalidate().then(function() {
      resolved = true;
    });
  });

  ok(resolved, 'Ember.SimpleAuth.Authenticators.Base returns a resolving promise for session invalidation.');
});
