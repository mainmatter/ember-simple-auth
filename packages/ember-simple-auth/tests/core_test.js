import { setup, initializeExtension, Configuration } from 'ember-simple-auth/core';
import { Base as Authorizer } from 'ember-simple-auth/authorizers/base';
import { Stores } from 'ember-simple-auth/stores';
import { Session } from 'ember-simple-auth/session';

describe('Configuration', function() {
  describe('authenticationRoute', function() {
    it('defaults to "login"', function() {
      expect(Configuration.authenticationRoute).to.eql('login');
    });
  });
  describe('routeAfterAuthentication', function() {
    it('defaults to "index"', function() {
      expect(Configuration.routeAfterAuthentication).to.eql('index');
    });
  });
  describe('applicationRootUrl', function() {
    it('defaults to null', function() {
      expect(Configuration.applicationRootUrl).to.be.null;
    });
  });
});

describe('setup', function() {
  beforeEach(function() {
    this.container    = { register: function() {}, injection: function() {}, lookup: function() {} };
    this.authorizer   = { set: function() {}, authorize: function() {} };
    this.application  = {};
    var containerStub = sinon.stub(this.container, 'lookup');
    containerStub.withArgs('router:main').returns({ get: function() { return 'rootURL'; } });
    containerStub.withArgs('authorizerFactory').returns(this.authorizer);
  });

  it('calls all registered extension initializers', function() {
    var initializer1 = sinon.spy();
    var initializer2 = sinon.spy();
    initializeExtension(initializer1);
    initializeExtension(initializer2);
    setup(this.container, this.application, 'authorizerFactory', {});

    expect(initializer1.withArgs(this.container, this.application, {})).to.have.been.calledOnce;
    expect(initializer2.withArgs(this.container, this.application, {})).to.have.been.calledOnce;
  });

  it('sets authenticationRoute', function() {
    setup(this.container, this.application, 'authorizerFactory', { authenticationRoute: 'authenticationRoute' });

    expect(Configuration.authenticationRoute).to.eql('authenticationRoute');
  });

  it('sets routeAfterAuthentication', function() {
    setup(this.container, this.application, 'authorizerFactory', { routeAfterAuthentication: 'routeAfterAuthentication' });

    expect(Configuration.routeAfterAuthentication).to.eql('routeAfterAuthentication');
  });

  it("sets applicationRootUrl to the application's root URL", function() {
    setup(this.container, this.application, 'authorizerFactory');

    expect(Configuration.applicationRootUrl).to.eql('rootURL');
  });

  describe('the session instance', function() {
    beforeEach(function() {
      sinon.spy(this.container, 'register');
    });

    it('uses the LocalStorage store by default', function() {
      setup(this.container, this.application, 'authorizerFactory');
      var spyCall = this.container.register.getCall(0);

      expect(spyCall.args[1].store.constructor).to.eql(Stores.LocalStorage);
    });

    it('uses a custom store if specified', function() {
      setup(this.container, this.application, 'authorizerFactory', { store: Stores.Ephemeral });
      var spyCall = this.container.register.getCall(0);

      expect(spyCall.args[1].store.constructor).to.eql(Stores.Ephemeral);
    });

    it("uses the app's container", function() {
      setup(this.container, this.application, 'authorizerFactory');
      var spyCall = this.container.register.getCall(0);

      expect(spyCall.args[1].container).to.eql(this.container);
    });

    it('is registered with the Ember container', function() {
      setup(this.container, this.application, 'authorizerFactory');
      var spyCall = this.container.register.getCall(0);

      expect(spyCall.args[0]).to.eql('ember-simple-auth:session:current');
      expect(spyCall.args[1].constructor).to.eql(Session);
    });

    it('is injected as "session" into all models, controllers, routes and views', function() {
      var _this = this;
      sinon.spy(this.container, 'injection');
      setup(this.container, this.application, 'authorizerFactory');

      ['model', 'controller', 'view', 'route'].forEach(function(component) {
        expect(_this.container.injection).to.have.been.calledWith(component, 'session', 'ember-simple-auth:session:current');
      });
    });
  });

  describe('the AJAX prefilter', function() {
    beforeEach(function() {
      sinon.spy(this.authorizer, 'authorize');
    });

    it('uses the configured authorizer', function() {
      setup(this.container, this.application, 'authorizerFactory', { authorizer: this.CustomAuthorizer });
      Ember.$.get(window.location);

      expect(this.authorizer.authorize).to.have.been.calledOnce;
    });

    it('does not authorize requests going to a foreign origin', function() {
      setup(this.container, this.application, 'authorizerFactory');
      Ember.$.get('http://other-domain.com');

      expect(this.authorizer.authorize).to.not.have.been.called;
    });

    it('authorizes requests going to a foreign origin if the origin is whitelisted', function() {
      setup(this.container, this.application, 'authorizerFactory', { crossOriginWhitelist: ['http://other-domain.com', 'https://another-port.net:4567'] });
      Ember.$.get('http://other-domain.com/path/query=string');

      expect(this.authorizer.authorize).to.have.been.calledOnce;

      Ember.$.get('http://other-domain.com:80/path/query=string');

      expect(this.authorizer.authorize).to.have.been.calledTwice;

      Ember.$.get('https://another-port.net:4567/path/query=string');

      expect(this.authorizer.authorize).to.have.been.calledThrice;
    });
  });
});
