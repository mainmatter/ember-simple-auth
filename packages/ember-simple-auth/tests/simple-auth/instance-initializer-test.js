import instanceInitializer from 'simple-auth/instance-initializer';

describe('the "simple-auth" instance initializer', function() {
  it('has the correct name', function() {
    expect(instanceInitializer.name).to.eq('simple-auth');
  });
});
