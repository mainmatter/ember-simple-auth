import { module, test } from 'qunit';
import assign from 'ember-simple-auth/utils/assign';

module('Unit | Utility | assign', function() {
  test('it works', function(assert) {
    let result = assign({ foo: 'foo' }, { bar: 'bar' });

    assert.deepEqual(result, { foo: 'foo', bar: 'bar' });
  });
});
