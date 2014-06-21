import initializer from 'ember-simple-auth-cookie-store/initializer';
import Store from 'ember-simple-auth-cookie-store/stores/cookie';

describe('the "ember-simple-auth-cookie" initializer', function() {
  it('has the correct name', function() {
    expect(initializer.name).to.eq('ember-simple-auth-cookie-store');
  });

  it('runs before the "ember-simple-auth" initializer', function() {
    expect(initializer.before).to.eq('ember-simple-auth');
  });

  describe('the initialize method', function() {
    beforeEach(function() {
      this.container = { register: function() {} };
      sinon.spy(this.container, 'register');
    });

    it('registers the store with the Ember container', function() {
      initializer.initialize(this.container);
      var spyCall = this.container.register.getCall(0);

      expect(spyCall.args[0]).to.eql('ember-simple-auth-session-store:cookie');
      expect(spyCall.args[1]).to.eql(Store);
    });
  });
});
