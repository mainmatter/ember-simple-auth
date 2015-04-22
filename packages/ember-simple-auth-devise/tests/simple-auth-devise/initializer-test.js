import initializer from 'simple-auth-devise/initializer';
import Authenticator from 'simple-auth-devise/authenticators/devise';
import Authorizer from 'simple-auth-devise/authorizers/devise';

describe('the "simple-auth-devise" initializer', function() {
  it('has the correct name', function() {
    expect(initializer.name).to.eq('simple-auth-devise');
  });

  it('runs before the "simple-auth" initializer', function() {
    expect(initializer.before).to.eq('simple-auth');
  });

  describe('the initialize method', function() {
    beforeEach(function() {
      this.application = { register: function() {} };
      sinon.spy(this.application, 'register');
    });

    it('registers the authorizer with the Ember container', function() {
      initializer.initialize(null, this.application);
      var spyCall = this.application.register.getCall(0);

      expect(spyCall.args[0]).to.eql('simple-auth-authorizer:devise');
      expect(spyCall.args[1]).to.eql(Authorizer);
    });

    it('registers the authenticator with the Ember container', function() {
      initializer.initialize(null, this.application);

      var spyCall = this.application.register.getCall(1);

      expect(spyCall.args[0]).to.eql('simple-auth-authenticator:devise');
      expect(spyCall.args[1]).to.eql(Authenticator);
    });
  });
});
