var store;

function restore(properties) {
  var restored;
  Ember.run(function() {
    store.restore().then(function(properties) { restored = properties });
  });
  return restored;
}

function save(properties) {
  Ember.run(function() {
    store.save(properties);
  });
}

function load(key) {
  var loaded;
  Ember.run(function() {
    store.load(key).then(function(value) { loaded = value; });
  });
  return loaded;
}

module('Ember.SimpleAuth.Stores.Ephemeral', {
  setup: function() {
    store = Ember.SimpleAuth.Stores.Ephemeral.create();
  }
});

test('clears itself', function() {
  save({ key1: 'value1', key2: 'value2' });
  Ember.run(function() {
    store.clear();
  });

  equal(load('key1'), undefined, 'Ember.SimpleAuth.Stores.Ephemeral deletes all properties when cleared.');
  equal(load('key2'), undefined, 'Ember.SimpleAuth.Stores.Ephemeral deletes all properties when cleared.');
});

test('restores properties', function() {
  deepEqual(restore(), {}, 'Ember.SimpleAuth.Stores.Ephemeral returns an empty plain object when no properties are stored.');

  save({ key1: 'value1', key2: 'value2' });
  deepEqual(restore(), { key1: 'value1', key2: 'value2' }, 'Ember.SimpleAuth.Stores.Ephemeral returns all stored properties.');

  var restoredProperties = restore()
  restoredProperties.key1 = 'another value';
  deepEqual(restore(), { key1: 'value1', key2: 'value2' }, 'Ember.SimpleAuth.Stores.Ephemeral does returns a copy of the stored properties.');
});

test('saves properties', function() {
  var afterRoundtrip;
  save({ key: 'value' });
  equal(load('key'), 'value', 'Ember.SimpleAuth.Stores.Ephemeral saves a property and loads it again.');

  save({ key1: 'value1', key2: 'value2' });
  equal(load('key1'), 'value1', 'Ember.SimpleAuth.Stores.Ephemeral saves multiple properties.');
  equal(load('key2'), 'value2', 'Ember.SimpleAuth.Stores.Ephemeral saves multiple properties.');
  equal(load('key'), 'value', 'Ember.SimpleAuth.Stores.Ephemeral does not destroy previously stored properties when save is called again.');

  save({ key: '' });
  equal(load('key'), undefined, 'Ember.SimpleAuth.Stores.Ephemeral deletes empty properties when saving.');
});
