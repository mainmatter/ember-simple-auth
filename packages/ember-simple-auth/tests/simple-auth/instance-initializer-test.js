import initializer from 'simple-auth/instaince-initializer';

describe('the "simple-auth" instaince initializer', function() {
  it('has the correct name', function() {
    expect(initializer.name).to.eq('simple-auth');
  });
});
