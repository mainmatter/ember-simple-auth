import { module, test } from 'qunit';

module('Unit | Utility | assign', function () {
  test('it works', function (assert) {
    let result = Object.assign({ foo: 'foo' }, { bar: 'bar' });

    assert.deepEqual(result, { foo: 'foo', bar: 'bar' });
  });
});
