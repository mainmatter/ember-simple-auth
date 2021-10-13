import { module, test } from 'qunit';
import * as LocationUtil from 'ember-simple-auth/utils/location';
import sinonjs from 'sinon';

// eslint-disable-next-line
const foo = {
  get hash() {
    return LocationUtil.default().hash;
  }
};

module('Unit | Utility | location', function(hooks) {
  let sinon;
  hooks.beforeEach(function() {
    sinon = sinonjs.createSandbox();
  });
  hooks.afterEach(function() {
    sinon.restore();
  });
  test('works', function(assert) {
    assert.ok(LocationUtil.default());
    assert.equal(typeof LocationUtil.default().hash, 'string');
  });
});
