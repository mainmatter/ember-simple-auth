import setup from 'simple-auth/setup';
import Configuration from 'simple-auth/configuration';
import Session from 'simple-auth/session';
import LocalStorageStore from 'simple-auth/stores/local-storage';
import EphemeralStore from 'simple-auth/stores/ephemeral';

describe('setup', function() {
  beforeEach(function() {
    this.container   = { register: function() {}, injection: function() {}, lookup: function() {} };
    this.application = { deferReadiness: function() {}, advanceReadiness: function() {} };
    this.router      = { get: function() { return 'rootURL'; }, send: function() {} };
    this.store       = EphemeralStore.create();
    this.session     = Session.create();
    this.session.setProperties({ store: this.store, container: this.container });
    this.containerStub = sinon.stub(this.container, 'lookup');
    this.containerStub.withArgs('router:main').returns(this.router);
    this.containerStub.withArgs('simple-auth-session-store:local-storage').returns(this.store);
    this.containerStub.withArgs('simple-auth-session:main').returns(this.session);
  });

  it("defers the application's readiness", function() {
    sinon.spy(this.application, 'deferReadiness');
    setup(this.container, this.application, {});

    expect(this.application.deferReadiness).to.have.been.calledOnce;
  });

  it("sets applicationRootUrl to the application's root URL", function() {
    setup(this.container, this.application);

    expect(Configuration.applicationRootUrl).to.eql('rootURL');
  });

  it('registers the LocalStorage store', function() {
    sinon.spy(this.container, 'register');
    setup(this.container, this.application);

    expect(this.container.register).to.have.been.calledWith('simple-auth-session-store:local-storage', LocalStorageStore);
  });

  it('registers the Ephemeral store', function() {
    sinon.spy(this.container, 'register');
    setup(this.container, this.application);

    expect(this.container.register).to.have.been.calledWith('simple-auth-session-store:ephemeral', EphemeralStore);
  });

  it('registers the Session', function() {
    sinon.spy(this.container, 'register');
    setup(this.container, this.application);

    expect(this.container.register).to.have.been.calledWith('simple-auth-session:main', Session);
  });

  describe('the session instance', function() {
    beforeEach(function() {
      Configuration.store = 'simple-auth-session-store:local-storage';
    });

    context('when a custom session class is configured', function() {
      beforeEach(function() {
        this.originalSessionFactory = Configuration.session;
        Configuration.session       = 'session:custom';
        this.otherSession           = Session.extend().create({ store: this.store, container: this.container });
        this.containerStub.withArgs('session:custom').returns(this.otherSession);
        sinon.spy(this.container, 'injection');
      });

      it('is of that class', function() {
        setup(this.container, this.application);

        var spyCall = this.container.injection.getCall(0);
        expect(spyCall.args[2]).to.eql('session:custom');
      });

      afterEach(function() {
        Configuration.session = this.originalSessionFactory;
      });
    });

    it('uses the LocalStorage store by default', function() {
      setup(this.container, this.application);

      expect(this.session.store).to.eql(this.store);
    });

    it('uses a custom store if specified', function() {
      Configuration.store = 'simple-auth-session-store:ephemeral';
      var store = EphemeralStore.create();
      this.containerStub.withArgs('simple-auth-session-store:ephemeral').returns(store);
      setup(this.container, this.application);

      expect(this.session.store).to.eql(store);
    });

    it("uses the app's container", function() {
      setup(this.container, this.application);

      expect(this.session.container).to.eql(this.container);
    });

    it('is injected into all controllers and routes', function() {
      var _this = this;
      sinon.spy(this.container, 'injection');
      setup(this.container, this.application);

      ['controller', 'route'].forEach(function(component) {
        expect(_this.container.injection).to.have.been.calledWith(component, Configuration.sessionPropertyName, Configuration.session);
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
      Configuration.authorizer = 'authorizer';
      this.authorizer = { set: function() {}, authorize: function() {} };
      this.containerStub.withArgs('authorizer').returns(this.authorizer);
      sinon.spy(this.authorizer, 'authorize');
      sinon.spy(Ember.$, 'ajaxPrefilter');
    });

    it('registers an AJAX prefilter', function() {
      setup(this.container, this.application);

      expect(Ember.$.ajaxPrefilter).to.have.been.calledOnce;
    });

    describe('the AJAX prefilter', function() {
      it('uses the configured authorizer', function() {
        setup(this.container, this.application);
        Ember.$.get(window.location);

        expect(this.authorizer.authorize).to.have.been.calledOnce;
      });

      it('does not use destroyed authorizers', function() {
        this.authorizer.isDestroyed = true;
        setup(this.container, this.application);
        Ember.$.get(window.location);

        expect(this.authorizer.authorize).to.not.have.been.called;
      });

      it('does not authorize requests going to a foreign origin', function() {
        setup(this.container, this.application);
        Ember.$.get('http://other-domain.com');

        expect(this.authorizer.authorize).to.not.have.been.called;
      });

      it('authorizes requests going to a foreign origin if the origin is whitelisted', function() {
        Configuration.crossOriginWhitelist = ['http://other-domain.com', 'https://another-port.net:4567'];
        setup(this.container, this.application);
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
        setup(this.container, this.application);
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
