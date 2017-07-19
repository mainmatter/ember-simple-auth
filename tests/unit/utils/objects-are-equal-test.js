import { describe, it } from 'mocha';
import { expect } from 'chai';
import objectsAreEqual from 'ember-simple-auth/utils/objects-are-equal';

describe('objectsAreEqual', () => {
  it('is true for equal objects', function() {
    expect(objectsAreEqual({ a: 'b', c: 'd' }, { a: 'b', c: 'd' })).to.be.true;
  });

  it('is true for equal objects regardless of property order', function() {
    expect(objectsAreEqual({ a: 'b', c: 'd' }, { c: 'd', a: 'b' })).to.be.true;
  });

  it('is true for equal nested objects regardless of property order', function() {
    expect(objectsAreEqual({ a: 'b', c: 'd', e: { f: 'g' } }, { e: { f: 'g' }, a: 'b', c: 'd' })).to.be.true;
  });

  it('is true for equal objects that include arrays', function() {
    expect(objectsAreEqual({ a: ['b', 'c'] }, { a: ['b', 'c'] })).to.be.true;
  });

  it('is false for equal objects that include differently ordered arrays', function() {
    expect(objectsAreEqual({ a: ['b', 'c'] }, { a: ['c', 'b'] })).to.be.false;
  });

  it('is false for unequal objects', function() {
    expect(objectsAreEqual({ a: 'b' }, { c: 'd' })).to.be.false;
  });
});
