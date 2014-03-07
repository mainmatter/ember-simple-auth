import { setup, Configuration } from 'ember-simple-auth/core';
import { Authenticators } from 'ember-simple-auth/authenticators';
import { Authorizers } from 'ember-simple-auth/authorizers';
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
    this.container = { register: function() {}, injection: function() {}, lookup: function() {} };
    sinon.stub(this.container, 'lookup').returns({ get: function() { return 'rootURL'; } });
    this.application = {};
  });

  it('sets authenticationRoute', function() {
    setup(this.container, this.application, { authenticationRoute: 'authenticationRoute' });

    expect(Configuration.authenticationRoute).to.eql('authenticationRoute');
  });

  it('sets routeAfterAuthentication', function() {
    setup(this.container, this.application, { routeAfterAuthentication: 'routeAfterAuthentication' });

    expect(Configuration.routeAfterAuthentication).to.eql('routeAfterAuthentication');
  });

  it("sets applicationRootUrl to the application's root Url", function() {
    setup(this.container, this.application);

    expect(Configuration.applicationRootUrl).to.eql('rootURL');
  });

  it('registers the OAuth2 authenticator with the container', function() {
    sinon.spy(this.container, 'register');
    setup(this.container, this.application);

    expect(this.container.register).to.have.been.calledWith('ember-simple-auth:authenticators:oauth2', Authenticators.OAuth2);
  });

  describe('the session instance', function() {
    beforeEach(function() {
      sinon.spy(this.container, 'register');
    });

    it('uses the LocalStorage store by default', function() {
      setup(this.container, this.application);
      var spyCall = this.container.register.getCall(1);

      expect(spyCall.args[1].store.constructor).to.eql(Stores.LocalStorage);
    });

    it('uses a custom store if specified', function() {
      setup(this.container, this.application, { store: Stores.Ephemeral });
      var spyCall = this.container.register.getCall(1);

      expect(spyCall.args[1].store.constructor).to.eql(Stores.Ephemeral);
    });

    it("uses the app's container", function() {
      setup(this.container, this.application);
      var spyCall = this.container.register.getCall(1);

      expect(spyCall.args[1].container).to.eql(this.container);
    });

    it('is registered with the Ember container', function() {
      setup(this.container, this.application);
      var spyCall = this.container.register.getCall(1);

      expect(spyCall.args[0]).to.eql('ember-simple-auth:session:current');
      expect(spyCall.args[1].constructor).to.eql(Session);
    });

    it('is injected as "session" into all models, controllers, routes and views', function() {
      var _this = this;
      sinon.spy(this.container, 'injection');
      setup(this.container, this.application);

      ['model', 'controller', 'view', 'route'].forEach(function(component) {
        expect(_this.container.injection).to.have.been.calledWith(component, 'session', 'ember-simple-auth:session:current');
      });
    });
  });

  describe('the AJAX prefilter', function() {
    beforeEach(function() {
      this.authorizer = { authorize: function() {} };
      sinon.spy(this.authorizer, 'authorize');
      sinon.stub(Authorizers.OAuth2, 'create').returns(this.authorizer);
    });

    it('uses the OAuth2 authorizer by default', function() {
      setup(this.container, this.application);
      Ember.$.get(window.location);

      expect(this.authorizer.authorize).to.have.been.calledOnce;
    });

    it('uses a custom authorizer if configured', function() {
      var CustomAuthorizer = Authorizers.Base.extend();
      sinon.stub(CustomAuthorizer, 'create').returns(this.authorizer);
      setup(this.container, this.application, { authorizer: CustomAuthorizer });
      Ember.$.get(window.location);

      expect(this.authorizer.authorize).to.have.been.calledOnce;
    });

    it('does not authorize requests going to a foreign origin', function() {
      setup(this.container, this.application);
      Ember.$.get('http://other-domain.com');

      expect(this.authorizer.authorize).to.not.have.been.called;
    });

    it('authorize requests going to a foreign origin if the origin is whitelisted', function() {
      setup(this.container, this.application, { crossOriginWhitelist: ['http://other-domain.com', 'https://another-port.net:4567'] });
      Ember.$.get('http://other-domain.com/path/query=string');

      expect(this.authorizer.authorize).to.have.been.calledOnce;

      Ember.$.get('http://other-domain.com:80/path/query=string');

      expect(this.authorizer.authorize).to.have.been.calledTwice;

      Ember.$.get('https://another-port.net:4567/path/query=string');

      expect(this.authorizer.authorize).to.have.been.calledThrice;
    });

    afterEach(function() {
      Authorizers.OAuth2.create.restore();
    });
  });
});
