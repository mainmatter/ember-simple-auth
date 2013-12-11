var store;

module('Ember.SimpleAuth.Stores.Cookie', {
  setup: function() {
    store = Ember.SimpleAuth.Stores.Cookie.create();
  },
  teardown: function() {
    store.clear();
  }
});

test('clears itself', function() {
  store.save({ key1: 'value1', key2: 'value2' });
  store.clear();

  equal(store.load('key1'), undefined, 'Ember.SimpleAuth.Stores.Cookie deletes all properties when cleared.');
  equal(store.load('key2'), undefined, 'Ember.SimpleAuth.Stores.Cookie deletes all properties when cleared.');
});

test('restores properties', function() {
  deepEqual(store.restore(), {}, 'Ember.SimpleAuth.Stores.Cookie returns an empty plain object on restore when no properties are stored.');

  store.save({ key1: 'value1', key2: 'value2' });
  deepEqual(store.restore(), { key1: 'value1', key2: 'value2' }, 'Ember.SimpleAuth.Stores.Cookie returns all stored properties on restore.');
});

test('saves properties', function() {
  store.save({ key: 'value' });
  equal(store.load('key'), 'value', 'Ember.SimpleAuth.Stores.Cookie saves a property and loads it again.');

  store.save({ key1: 'value1', key2: 'value2' });
  equal(store.load('key1'), 'value1', 'Ember.SimpleAuth.Stores.Cookie saves multiple properties.');
  equal(store.load('key2'), 'value2', 'Ember.SimpleAuth.Stores.Cookie saves multiple properties.');
  equal(store.load('key'), 'value', 'Ember.SimpleAuth.Stores.Cookie does not destroy previously stored properties when save is called again.');

  store.save({ key: '' });
  equal(store.load('key'), undefined, 'Ember.SimpleAuth.Stores.Cookie deletes empty properties when saving.');
  ok(!document.cookie.match(/key=/), 'Ember.SimpleAuth.Stores.Cookie clears the cookies for empty properties when saving.');
});

test('recognizes when the cookies change', function() {
  var triggered;
  store.save({ key: 'value' });
  document.cookie = 'ember_simple_auth:key=other value;';
  store.one('updated_session_data', function() {
    triggered = true;
  });
  store.syncProperties();

  equal(store.load('key'), 'other value', 'Ember.SimpleAuth.Stores.Cookie recognizes when the cookies change.');
  ok(triggered, 'Ember.SimpleAuth.Stores.Cookie triggers the "updated_session_data" when the cookies change.');
});
