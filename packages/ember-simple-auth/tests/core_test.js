import { setup, initializeExtension, Configuration } from 'ember-simple-auth/core';
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
    this.container     = { register: function() {}, injection: function() {}, lookup: function() {} };
    this.application   = {};
    this.store         = Stores.LocalStorage.create();
    this.containerStub = sinon.stub(this.container, 'lookup');
    this.containerStub.withArgs('router:main').returns({ get: function() { return 'rootURL'; } });
    this.containerStub.withArgs('session-store:local-storage').returns(this.store);
  });

  it('calls all registered extension initializers', function() {
    var initializer1 = sinon.spy();
    var initializer2 = sinon.spy();
    initializeExtension(initializer1);
    initializeExtension(initializer2);
    setup(this.container, this.application, {});

    expect(initializer1).to.have.been.calledOnce;
    expect(initializer2).to.have.been.calledOnce;
  });

  it('sets authenticationRoute', function() {
    setup(this.container, this.application, { authenticationRoute: 'authenticationRoute' });

    expect(Configuration.authenticationRoute).to.eql('authenticationRoute');
  });

  it('sets routeAfterAuthentication', function() {
    setup(this.container, this.application, { routeAfterAuthentication: 'routeAfterAuthentication' });

    expect(Configuration.routeAfterAuthentication).to.eql('routeAfterAuthentication');
  });

  it("sets applicationRootUrl to the application's root URL", function() {
    setup(this.container, this.application);

    expect(Configuration.applicationRootUrl).to.eql('rootURL');
  });

  describe('the session instance', function() {
    beforeEach(function() {
      sinon.spy(this.container, 'register');
    });

    it('uses the LocalStorage store by default', function() {
      setup(this.container, this.application);
      var spyCall = this.container.register.getCall(2);

      expect(spyCall.args[1].store).to.eql(this.store);
    });

    it('uses a custom store if specified', function() {
      var store = Stores.Ephemeral.create();
      this.containerStub.withArgs('session-store:ephemeral').returns(store);
      setup(this.container, this.application, { storeFactory: 'session-store:ephemeral' });
      var spyCall = this.container.register.getCall(2);

      expect(spyCall.args[1].store).to.eql(store);
    });

    it("uses the app's container", function() {
      setup(this.container, this.application);
      var spyCall = this.container.register.getCall(2);

      expect(spyCall.args[1].container).to.eql(this.container);
    });

    it('is registered with the Ember container', function() {
      setup(this.container, this.application);
      var spyCall = this.container.register.getCall(2);

      expect(spyCall.args[0]).to.eql('session:main');
      expect(spyCall.args[1].constructor).to.eql(Session);
    });

    it('is injected as "session" into all models, controllers, routes and views', function() {
      var _this = this;
      sinon.spy(this.container, 'injection');
      setup(this.container, this.application);

      ['model', 'controller', 'view', 'route'].forEach(function(component) {
        expect(_this.container.injection).to.have.been.calledWith(component, 'session', 'session:main');
      });
    });
  });

  describe('when an authorizer factory is specified', function() {
    beforeEach(function() {
      this.authorizer = { set: function() {}, authorize: function() {} };
      this.containerStub.withArgs('authorizerFactory').returns(this.authorizer);
      sinon.spy(this.authorizer, 'authorize');
      sinon.spy(Ember.$, 'ajaxPrefilter');
    });

    it('registers an AJAX prefilter', function() {
      setup(this.container, this.application, { authorizerFactory: 'authorizerFactory' });

      expect(Ember.$.ajaxPrefilter).to.have.been.calledOnce;
    });

    describe('the AJAX prefilter', function() {
      it('uses the configured authorizer', function() {
        setup(this.container, this.application, { authorizerFactory: 'authorizerFactory' });
        Ember.$.get(window.location);

        expect(this.authorizer.authorize).to.have.been.calledOnce;
      });

      it('does not authorize requests going to a foreign origin', function() {
        setup(this.container, this.application, { authorizerFactory: 'authorizerFactory' });
        Ember.$.get('http://other-domain.com');

        expect(this.authorizer.authorize).to.not.have.been.called;
      });

      it('authorizes requests going to a foreign origin if the origin is whitelisted', function() {
        setup(this.container, this.application, {
          authorizerFactory:    'authorizerFactory',
          crossOriginWhitelist: ['http://other-domain.com', 'https://another-port.net:4567']
        });
        Ember.$.get('http://other-domain.com/path/query=string');

        expect(this.authorizer.authorize).to.have.been.calledOnce;

        Ember.$.get('http://other-domain.com:80/path/query=string');

        expect(this.authorizer.authorize).to.have.been.calledTwice;

        Ember.$.get('https://another-port.net:4567/path/query=string');

        expect(this.authorizer.authorize).to.have.been.calledThrice;
      });
    });

    afterEach(function() {
      Ember.$.ajaxPrefilter.restore();
    });
  });

  describe('when no authorizer factory is specified', function() {
    it('does not register an AJAX prefilter', function() {
      sinon.spy(Ember.$, 'ajaxPrefilter');
      setup(this.container, this.application);

      expect(Ember.$.ajaxPrefilter).to.not.have.been.called;
    });
  });
});
