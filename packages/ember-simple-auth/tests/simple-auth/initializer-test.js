import initializer from 'simple-auth/initializer';

describe('the "simple-auth" initializer', function() {
  it('has the correct name', function() {
    expect(initializer.name).to.eq('simple-auth');
  });
});
