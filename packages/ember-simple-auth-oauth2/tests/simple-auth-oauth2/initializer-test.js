import initializer from 'simple-auth-oauth2/initializer';
import Authenticator from 'simple-auth-oauth2/authenticators/oauth2';
import BearerAuthorizer from 'simple-auth-oauth2/authorizers/oauth2';
import AccessTokenAuthorizer from 'simple-auth-oauth2/authorizers/oauth2-access-token';

describe('the "simple-auth-oauth2" initializer', function() {
  it('has the correct name', function() {
    expect(initializer.name).to.eq('simple-auth-oauth2');
  });

  it('runs before the "simple-auth" initializer', function() {
    expect(initializer.before).to.eq('simple-auth');
  });

  describe('the initialize method', function() {
    beforeEach(function() {
      this.container = { register: function() {} };
      sinon.spy(this.container, 'register');
    });

    it('registers the bearer authorizer with the Ember container', function() {
      initializer.initialize(this.container);
      var spyCall = this.container.register.getCall(0);

      expect(spyCall.args[0]).to.eql('simple-auth-authorizer:oauth2-bearer');
      expect(spyCall.args[1]).to.eql(BearerAuthorizer);
    });

    it('registers the access token authorizer with the Ember container', function() {
      initializer.initialize(this.container);
      var spyCall = this.container.register.getCall(1);

      expect(spyCall.args[0]).to.eql('simple-auth-authorizer:oauth2-access-token');
      expect(spyCall.args[1]).to.eql(AccessTokenAuthorizer);
    });

    it('registers the authenticator with the Ember container', function() {
      initializer.initialize(this.container);

      var spyCall = this.container.register.getCall(2);

      expect(spyCall.args[0]).to.eql('simple-auth-authenticator:oauth2-password-grant');
      expect(spyCall.args[1]).to.eql(Authenticator);
    });
  });
});
