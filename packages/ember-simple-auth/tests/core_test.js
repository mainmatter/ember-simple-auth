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
  describe('sessionPropertyName', function() {
    it('defaults to "session"', function() {
      expect(Configuration.sessionPropertyName).to.eql('session');
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
    this.application   = { deferReadiness: function() {}, advanceReadiness: function() {} };
    this.router        = { get: function() { return 'rootURL'; }, send: function() {} };
    this.store         = Stores.LocalStorage.create();
    this.containerStub = sinon.stub(this.container, 'lookup');
    this.containerStub.withArgs('router:main').returns(this.router);
    this.containerStub.withArgs('ember-simple-auth-session-store:local-storage').returns(this.store);
  });

  it("defers the application's readiness", function() {
    sinon.spy(this.application, 'deferReadiness');
    setup(this.container, this.application, {});

    expect(this.application.deferReadiness).to.have.been.calledOnce;
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

  it('sets sessionPropertyName', function() {
    setup(this.container, this.application, { sessionPropertyName: 'sessionPropertyName' });

    expect(Configuration.sessionPropertyName).to.eql('sessionPropertyName');
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
      this.containerStub.withArgs('ember-simple-auth-session-store:ephemeral').returns(store);
      setup(this.container, this.application, { storeFactory: 'ember-simple-auth-session-store:ephemeral' });
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

      expect(spyCall.args[0]).to.eql('ember-simple-auth-session:main');
      expect(spyCall.args[1].constructor).to.eql(Session);
    });

    it('is injected into all controllers and routes', function() {
      var _this = this;
      sinon.spy(this.container, 'injection');
      setup(this.container, this.application, { sessionPropertyName: 'sessionPropertyName' });

      ['controller', 'route'].forEach(function(component) {
        expect(_this.container.injection).to.have.been.calledWith(component, 'sessionPropertyName', 'ember-simple-auth-session:main');
      });
    });
  });

  it("advances the application's readiness", function(done) {
    sinon.spy(this.application, 'advanceReadiness');
    setup(this.container, this.application, {});

    Ember.run.next(this, function() {
      expect(this.application.advanceReadiness).to.have.been.calledOnce;
      done();
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

      it('does not use destroyed authorizers', function() {
        this.authorizer.isDestroyed = true;
        setup(this.container, this.application, { authorizerFactory: 'authorizerFactory' });
        Ember.$.get(window.location);

        expect(this.authorizer.authorize).to.not.have.been.called;
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

    describe('the AJAX error handler', function() {
      beforeEach(function() {
        this.xhr                = sinon.useFakeXMLHttpRequest();
        this.server             = sinon.fakeServer.create();
        this.server.autoRespond = true;
        sinon.spy(this.container, 'register');
        setup(this.container, this.application, { authorizerFactory: 'authorizerFactory' });
        var spyCall  = this.container.register.getCall(2);
        this.session = spyCall.args[1];
      });

      describe("when the request's status is 401", function() {
        beforeEach(function() {
          this.server.respondWith('GET', '/data', [401, {}, '']);
        });

        it("triggers the session's authorizationFailed event", function(done) {
          var triggered = false;
          this.session.one('authorizationFailed', function() { triggered = true; });
          Ember.$.get('/data');

          Ember.run.later(function() {
            expect(triggered).to.be.true;
            done();
          }, 100);
        });
      });

      describe("when the request's status is not 401", function() {
        beforeEach(function() {
          this.server.respondWith('GET', '/data', [500, {}, '']);
        });

        it("does not trigger the session's authorizationFailed event", function(done) {
          var triggered = false;
          this.session.one('authorizationFailed', function() { triggered = true; });
          Ember.$.get('/data');

          Ember.run.later(function() {
            expect(triggered).to.be.false;
            done();
          }, 100);
        });
      });

      afterEach(function() {
        this.xhr.restore();
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

  after(function() {
    //reset default configuration values
    Configuration.authenticationRoute      = 'login';
    Configuration.routeAfterAuthentication = 'index';
    Configuration.sessionPropertyName      = 'session';
  });
});
