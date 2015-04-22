import initializer from 'simple-auth-oauth2/initializer';
import Authenticator from 'simple-auth-oauth2/authenticators/oauth2';
import Authorizer from 'simple-auth-oauth2/authorizers/oauth2';

describe('the "simple-auth-oauth2" initializer', function() {
  it('has the correct name', function() {
    expect(initializer.name).to.eq('simple-auth-oauth2');
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

      expect(spyCall.args[0]).to.eql('simple-auth-authorizer:oauth2-bearer');
      expect(spyCall.args[1]).to.eql(Authorizer);
    });

    it('registers the authenticator with the Ember container', function() {
      initializer.initialize(null, this.application);

      var spyCall = this.application.register.getCall(1);

      expect(spyCall.args[0]).to.eql('simple-auth-authenticator:oauth2-password-grant');
      expect(spyCall.args[1]).to.eql(Authenticator);
    });
  });
});
