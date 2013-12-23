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
  store.persist({ key1: 'value1', key2: 'value2' });
  store.clear();

  equal(store.restore().key1, null, 'Ember.SimpleAuth.Stores.Cookie deletes all properties when cleared.');
  equal(store.restore().key2, null, 'Ember.SimpleAuth.Stores.Cookie deletes all properties when cleared.');
});

test('loads all properties', function() {
  deepEqual(store.restore(), {}, 'Ember.SimpleAuth.Stores.Cookie returns an empty plain object when all properties are loaded but the store is empty');

  store.persist({ key1: 'value1', key2: 'value2' });
  deepEqual(store.restore(), { key1: 'value1', key2: 'value2' }, 'Ember.SimpleAuth.Stores.Cookie loads all stored properties.');
});

test('saves properties', function() {
  store.persist({ key: 'value' });
  equal(store.restore().key, 'value', 'Ember.SimpleAuth.Stores.Cookie saves a property and loads it again.');

  store.persist({ key1: 'value1', key2: 'value2' });
  equal(store.restore().key1, 'value1', 'Ember.SimpleAuth.Stores.Cookie saves multiple properties.');
  equal(store.restore().key2, 'value2', 'Ember.SimpleAuth.Stores.Cookie saves multiple properties.');
  equal(store.restore().key, 'value', 'Ember.SimpleAuth.Stores.Cookie does not destroy previously stored properties when save is called again.');
});

test('recognizes when the cookies change', function() {
  var triggered;
  store.persist({ key: 'value' });
  document.cookie = 'ember_simple_auth:key=other value;';
  store.one('ember-simple-auth:session-updated', function() {
    triggered = true;
  });
  store.syncProperties();

  equal(store.restore().key, 'other value', 'Ember.SimpleAuth.Stores.Cookie recognizes when the cookies changes.');
  ok(triggered, 'Ember.SimpleAuth.Stores.Cookie triggers the "updated_session_data" when the cookies changes.');

  triggered = false;
  store.one('ember-simple-auth:session-updated', function() {
    triggered = true;
  });
  store.syncProperties();

  ok(!triggered, 'Ember.SimpleAuth.Stores.Cookie does not trigger the "updated_session_data" when nothing actually cookies changed.');
});
