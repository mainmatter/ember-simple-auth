import { module, test } from 'qunit';
import objectsAreEqual from 'ember-simple-auth/utils/objects-are-equal';

module('objectsAreEqual', function() {
  test('is true for equal objects', function(assert) {
    assert.ok(objectsAreEqual({ a: 'b', c: 'd' }, { a: 'b', c: 'd' }));
  });

  test('is true for equal objects regardless of property order', function(assert) {
    assert.ok(objectsAreEqual({ a: 'b', c: 'd' }, { c: 'd', a: 'b' }));
  });

  test('is true for equal nested objects regardless of property order', function(assert) {
    assert.ok(objectsAreEqual({ a: 'b', c: 'd', e: { f: 'g' } }, { e: { f: 'g' }, a: 'b', c: 'd' }));
  });

  test('is true for equal objects that include arrays', function(assert) {
    assert.ok(objectsAreEqual({ a: ['b', 'c'] }, { a: ['b', 'c'] }));
  });

  test('is false for equal objects that include differently ordered arrays', function(assert) {
    assert.notOk(objectsAreEqual({ a: ['b', 'c'] }, { a: ['c', 'b'] }));
  });

  test('is false for unequal objects', function(assert) {
    assert.notOk(objectsAreEqual({ a: 'b' }, { c: 'd' }));
  });
});
