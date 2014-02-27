import { Ephemeral } from 'ember-simple-auth/stores/ephemeral';

describe('Stores.Ephemeral', function() {
  var store = Ephemeral.create();

  it('clears itself', function() {
    store.persist({ key1: 'value1', key2: 'value2' });
    store.clear();

    expect(store.restore().key1).to.be(undefined);
    expect(store.restore().key2).to.be(undefined);
  });
});

/*var store;

module('Stores.Ephemeral', {
  setup: function() {
    store = Ephemeral.create();
  }
});

test('clears itself', function() {
  store.persist({ key1: 'value1', key2: 'value2' });
  store.clear();

  equal(store.restore().key1, null, 'Ember.SimpleAuth.Stores.Ephemeral deletes all properties when it is cleared.');
  equal(store.restore().key2, null, 'Ember.SimpleAuth.Stores.Ephemeral deletes all properties when it is cleared.');
});

test('loads all properties', function() {
  deepEqual(store.restore(), {}, 'Ember.SimpleAuth.Stores.Ephemeral returns an empty plain object when all properties are loaded but the store is empty');

  store.persist({ key1: 'value1', key2: 'value2' });
  deepEqual(store.restore(), { key1: 'value1', key2: 'value2' }, 'Ember.SimpleAuth.Stores.Ephemeral loads all stored properties.');

  var loadedProperties = store.restore();
  loadedProperties.key1 = 'another value';
  deepEqual(store.restore(), { key1: 'value1', key2: 'value2' }, 'Ember.SimpleAuth.Stores.Ephemeral returns a copy of the stored properties when all properties are loaded.');
});

test('saves properties', function() {
  store.persist({ key: 'value' });
  equal(store.restore().key, 'value', 'Ember.SimpleAuth.Stores.Ephemeral saves a property and loads it again.');

  store.persist({ key1: 'value1', key2: 'value2' });
  equal(store.restore().key1, 'value1', 'Ember.SimpleAuth.Stores.Ephemeral saves multiple properties.');
  equal(store.restore().key2, 'value2', 'Ember.SimpleAuth.Stores.Ephemeral saves multiple properties.');
  equal(store.restore().key, 'value', 'Ember.SimpleAuth.Stores.Ephemeral does not destroy previously stored properties when it saves others.');
});
*/