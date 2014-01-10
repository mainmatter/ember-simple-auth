var authenticator;

module('Ember.SimpleAuth.Authenticators.Base', {
  setup: function() {
    authenticator = Ember.SimpleAuth.Authenticators.Base.create();
  }
});

test('it restores the session', function() {
  var rejected;
  Ember.run(function() {
    authenticator.restore({}).then(function() {}, function() {
      rejected = true;
    });
  });

  ok(rejected, 'Ember.SimpleAuth.Authenticators.Base returns a rejecting promise when it restores.');
});

test('invalidates the session', function() {
  var resolved;
  Ember.run(function() {
    authenticator.invalidate().then(function() {
      resolved = true;
    });
  });

  ok(resolved, 'Ember.SimpleAuth.Authenticators.Base returns a resolving promise on invalidation.');
});
