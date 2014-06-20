import initializer from 'ember-simple-auth/initializer';

describe('initializer', function() {

  it('returns an initializer with the correct name', function() {
    expect(initializer.name).to.eq('ember-simple-auth');
  });

});
