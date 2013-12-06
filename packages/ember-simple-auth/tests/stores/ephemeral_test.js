var store;

module('Ember.SimpleAuth.Stores.Ephemeral', {
  setup: function() {
    store = Ember.SimpleAuth.Stores.Ephemeral.create();
  }
});

test('clears itself', function() {
  store.save({ key1: 'value1', key2: 'value2' });
  store.clear();

  equal(store.load('key1'), undefined, 'Ember.SimpleAuth.Stores.Ephemeral deletes all properties when cleared.');
  equal(store.load('key2'), undefined, 'Ember.SimpleAuth.Stores.Ephemeral deletes all properties when cleared.');
});

test('restores properties', function() {
  deepEqual(store.restore(), {}, 'Ember.SimpleAuth.Stores.Ephemeral returns an empty plain object when no properties are stored.');

  store.save({ key1: 'value1', key2: 'value2' });
  deepEqual(store.restore(), { key1: 'value1', key2: 'value2' }, 'Ember.SimpleAuth.Stores.Ephemeral returns all stored properties.');

  var restoredProperties = store.restore()
  restoredProperties.key1 = 'another value';
  deepEqual(store.restore(), { key1: 'value1', key2: 'value2' }, 'Ember.SimpleAuth.Stores.Ephemeral does returns a copy of the stored properties.');
});

test('saves properties', function() {
  store.save({ key: 'value' });
  equal(store.load('key'), 'value', 'Ember.SimpleAuth.Stores.Ephemeral saves a property and loads it again.');

  store.save({ key1: 'value1', key2: 'value2' });
  equal(store.load('key1'), 'value1', 'Ember.SimpleAuth.Stores.Ephemeral saves multiple properties.');
  equal(store.load('key2'), 'value2', 'Ember.SimpleAuth.Stores.Ephemeral saves multiple properties.');
  equal(store.load('key'), 'value', 'Ember.SimpleAuth.Stores.Ephemeral does not destroy previously stored properties when save is called again.');

  store.save({ key: '' });
  equal(store.load('key'), undefined, 'Ember.SimpleAuth.Stores.Ephemeral deletes empty properties when saving.');
});
