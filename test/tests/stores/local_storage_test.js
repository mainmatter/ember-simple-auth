/*import { LocalStorage } from 'ember-simple-auth/stores/local_storage';

var store;

module('Stores.LocalStorage', {
  setup: function() {
    store = LocalStorage.create();
  },
  teardown: function() {
    store.clear();
  }
});

test('clears itself', function() {
  store.persist({ key1: 'value1', key2: 'value2' });
  store.clear();

  equal(store.restore().key1, null, 'Ember.SimpleAuth.Stores.LocalStorage deletes all properties when it is cleared.');
  equal(store.restore().key2, null, 'Ember.SimpleAuth.Stores.LocalStorage deletes all properties when it is cleared.');
});

test('loads all properties', function() {
  deepEqual(store.restore(), {}, 'Ember.SimpleAuth.Stores.LocalStorage returns an empty plain object when all properties are loaded but the store is empty');

  store.persist({ key1: 'value1', key2: 'value2' });
  deepEqual(store.restore(), { key1: 'value1', key2: 'value2' }, 'Ember.SimpleAuth.Stores.LocalStorage loads all stored properties.');
});

test('saves properties', function() {
  store.persist({ key: 'value' });
  equal(store.restore().key, 'value', 'Ember.SimpleAuth.Stores.LocalStorage saves a property and loads it again.');

  store.persist({ key1: 'value1', key2: 'value2' });
  equal(store.restore().key1, 'value1', 'Ember.SimpleAuth.Stores.LocalStorage saves multiple properties.');
  equal(store.restore().key2, 'value2', 'Ember.SimpleAuth.Stores.LocalStorage saves multiple properties.');
  equal(store.restore().key, 'value', 'Ember.SimpleAuth.Stores.LocalStorage does not destroy previously stored properties when it saves others.');
});
*/