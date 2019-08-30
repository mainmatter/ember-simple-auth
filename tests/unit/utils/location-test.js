import { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';
import * as LocationUtil from 'ember-simple-auth/utils/location';
import sinonjs from 'sinon';

// eslint-disable-next-line
const foo = {
  get hash() {
    return LocationUtil.default().hash;
  }
};

describe('Unit | Utility | location', function() {
  let sinon;
  beforeEach(function() {
    sinon = sinonjs.createSandbox();
  });
  afterEach(function() {
    sinon.restore();
  });
  it('works', function() {
    expect(LocationUtil.default()).to.be.ok;
    expect(LocationUtil.default().hash).to.be.a('string');
  });
});
