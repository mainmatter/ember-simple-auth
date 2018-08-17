import { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';
import * as LocationUtil from 'ember-simple-auth/utils/location';
import sinonjs from 'sinon';

const foo = {
  get hash() {
    return LocationUtil.default().hash;
  }
};

describe('Unit | Utility | location', function() {
  let sinon;
  beforeEach(function() {
    sinon = sinonjs.sandbox.create();
  });
  afterEach(function() {
    sinon.restore();
  });
  it('works', function() {
    expect(LocationUtil.default()).to.be.ok;
    expect(LocationUtil.default().hash).to.be.a('string');
  });
  it('works when stubbed', function() {
    expect(foo.hash).to.be.a('string');
    sinon.stub(LocationUtil, 'default').returns({ hash: 66 });
    expect(LocationUtil.default().hash).to.be.a('number');
    expect(foo.hash).to.be.a('number');
  });
});
