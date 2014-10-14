import objectsAreEqual from 'simple-auth/utils/objects-are-equal';

describe('Utils.objectsAreEqual', function() {
  it('is true for equal objects', function() {
    expect(objectsAreEqual({ a: 'b', c: 'd' }, { a: 'b', c: 'd' })).to.be.true;
  });

  it('is true for equal objects regardless of property order', function() {
    expect(objectsAreEqual({ a: 'b', c: 'd' }, { c: 'd', a: 'b' })).to.be.true;
  });

  it('is true for equal nested objects regardless of property order', function() {
    expect(objectsAreEqual({ a: 'b', c: 'd', e: { f: 'g' } }, { e: { f: 'g' }, a: 'b', c: 'd' })).to.be.true;
  });

  it('is false for unequal objects', function() {
    expect(objectsAreEqual({ a: 'b' }, { c: 'd' })).to.be.false;
  });
});
