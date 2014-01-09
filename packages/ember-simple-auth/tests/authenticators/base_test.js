var authenticator;

module('Ember.SimpleAuth.Authenticators.Base', {
  setup: function() {
    authenticator = Ember.SimpleAuth.Authenticators.Base.create();
  }
});

test('it restores the session', function() {
  var resolved;
  var resolvedWith;
  Ember.run(function() {
    authenticator.restore({ authToken: 'authToken', key: 'value' }).then(function(properties) {
      resolved     = true;
      resolvedWith = properties;
    });
  });

  ok(resolved, 'Ember.SimpleAuth.Authenticators.Base returns a resolving promise when the properties it restores from include an authToken.');
  deepEqual(resolvedWith, { authToken: 'authToken', key: 'value' }, 'Ember.SimpleAuth.Authenticators.Base returns a promise that resolves with the passed properties when the passed properties it restores from include an authToken.');

  var rejected;
  Ember.run(function() {
    authenticator.restore({}).then(function() {}, function() {
      rejected = true;
    });
  });

  ok(rejected, 'Ember.SimpleAuth.Authenticators.Base returns a rejecting promise when the properties it restores from do not include an authToken.');

  rejected = false;
  Ember.run(function() {
    authenticator.restore({ authToken: '' }).then(function() {}, function() {
      rejected = true;
    });
  });

  ok(rejected, 'Ember.SimpleAuth.Authenticators.Base returns a rejecting promise when the properties it restores from include an empty authToken.');
});

test('invalidates the session', function() {
  var resolved;
  Ember.run(function() {
    authenticator.invalidate().then(function(error) {
      resolved = true;
    });
  });

  ok(resolved, 'Ember.SimpleAuth.Authenticators.Base returns a resolving promise on invalidation.');
});
