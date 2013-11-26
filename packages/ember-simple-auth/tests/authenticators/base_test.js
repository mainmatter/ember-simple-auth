var authenticator;

var StoreMock = Ember.Object.extend();

module('Ember.SimpleAuth.Authenticators.Base');

test('assigns a store on initialization', function() {
  Ember.SimpleAuth.store = StoreMock;
  authenticator          = Ember.SimpleAuth.Authenticators.Base.create();

  console.log();
  ok(authenticator.get('store') instanceof StoreMock, 'Ember.SimpleAuth.Authorizers.Base assigns an instance of the store class defined in Ember.SimpleAuth.store on creation');
});
