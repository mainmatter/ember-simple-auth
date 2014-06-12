import flatObjectsAreEqual from 'ember-simple-auth/utils/flat_objects_are_equal';

describe('Utils.flatObjectsAreEqual', function() {
  it('is true for equal objects', function() {
    expect(flatObjectsAreEqual({ a: 'b', c: 'd' }, { a: 'b', c: 'd' })).to.be.true;
  });

  it('is true for equal objects regardless of property order', function() {
    expect(flatObjectsAreEqual({ a: 'b', c: 'd' }, { c: 'd', a: 'b' })).to.be.true;
  });

  it('is false for unequal objects', function() {
    expect(flatObjectsAreEqual({ a: 'b' }, { c: 'd' })).to.be.false;
  });
});
