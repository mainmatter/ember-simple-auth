var store;

module('Ember.SimpleAuth.Stores.LocalStorage', {
  setup: function() {
    store = Ember.SimpleAuth.Stores.LocalStorage.create();
  },
  teardown: function() {
    store.clear();
  }
});

test('clears itself', function() {
  store.save({ key1: 'value1', key2: 'value2' });
  store.clear();

  equal(store.load('key1'), undefined, 'Ember.SimpleAuth.Stores.LocalStorage deletes all properties when cleared.');
  equal(store.load('key2'), undefined, 'Ember.SimpleAuth.Stores.LocalStorage deletes all properties when cleared.');
});

test('restores properties', function() {
  deepEqual(store.restore(), {}, 'Ember.SimpleAuth.Stores.LocalStorage returns an empty plain object on restore when no properties are stored.');

  store.save({ key1: 'value1', key2: 'value2' });
  deepEqual(store.restore(), { key1: 'value1', key2: 'value2' }, 'Ember.SimpleAuth.Stores.LocalStorage returns all stored properties on restore.');
});

test('saves properties', function() {
  store.save({ key: 'value' });
  equal(store.load('key'), 'value', 'Ember.SimpleAuth.Stores.LocalStorage saves a property and loads it again.');

  store.save({ key1: 'value1', key2: 'value2' });
  equal(store.load('key1'), 'value1', 'Ember.SimpleAuth.Stores.LocalStorage saves multiple properties.');
  equal(store.load('key2'), 'value2', 'Ember.SimpleAuth.Stores.LocalStorage saves multiple properties.');
  equal(store.load('key'), 'value', 'Ember.SimpleAuth.Stores.LocalStorage does not destroy previously stored properties when save is called again.');

  store.save({ key: '' });
  equal(store.load('key'), undefined, 'Ember.SimpleAuth.Stores.LocalStorage deletes empty properties when saving.');
  equal(localStorage.getItem('ember_simple_auth:key'), null, 'Ember.SimpleAuth.Stores.LocalStorage clears the localStorage object for empty properties when saving.');
});
