import { module, test } from 'qunit';
import LocationUtil from 'ember-simple-auth/utils/location';
import sinonjs from 'sinon';

module('Unit | Utility | location', function (hooks) {
  let sinon;
  hooks.beforeEach(function () {
    sinon = sinonjs.createSandbox();
  });
  hooks.afterEach(function () {
    sinon.restore();
  });
  test('works', function (assert) {
    assert.ok(LocationUtil);
    assert.equal(typeof LocationUtil.replace, 'function');
  });
});
