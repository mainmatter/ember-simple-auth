import setup from 'simple-auth/setup';
import Configuration from 'simple-auth/configuration';
import Session from 'simple-auth/session';
import LocalStorageStore from 'simple-auth/stores/local-storage';
import EphemeralStore from 'simple-auth/stores/ephemeral';

describe('setup', function() {
  beforeEach(function() {
    this.application   = { register: function() {}, inject: function() {}, deferReadiness: function() {}, advanceReadiness: function() {} };
    this.container     = { lookup: function() {} };
    this.session       = Session.create();
    this.containerStub = sinon.stub(this.container, 'lookup');
    this.router        = { get: function() { return 'rootURL'; }, send: function() {} };
    this.store         = EphemeralStore.create();
    this.authorizer    = { set: function() {}, authorize: function() {} };
    this.session.setProperties({ store: this.store, container: this.container });

    this.containerStub.withArgs('router:main').returns(this.router);
    this.containerStub.withArgs('simple-auth-session-store:local-storage').returns(this.store);
    this.containerStub.withArgs('simple-auth-session:main').returns(this.session);
    this.containerStub.withArgs('authorizer').returns(this.authorizer);

    sinon.spy(this.application, 'register');
    sinon.spy(this.application, 'inject');

    sinon.spy(this.authorizer, 'authorize');
  });

  it("defers the application's readiness", function() {
    sinon.spy(this.application, 'deferReadiness');
    setup(this.container, this.application, {});

    expect(this.application.deferReadiness).to.have.been.calledOnce;
  });

  it('registers the LocalStorage store', function() {
    setup(this.container, this.application);

    expect(this.application.register).to.have.been.calledWith('simple-auth-session-store:local-storage', LocalStorageStore);
  });

  it('registers the Ephemeral store', function() {
    setup(this.container, this.application);

    expect(this.application.register).to.have.been.calledWith('simple-auth-session-store:ephemeral', EphemeralStore);
  });

  it('registers the Session', function() {
    setup(this.container, this.application);

    expect(this.application.register).to.have.been.calledWith('simple-auth-session:main', Session);
  });

  describe('the session instance', function() {
    beforeEach(function() {
      Configuration.store = 'simple-auth-session-store:local-storage';
    });

    context('when a custom session class is configured', function() {
      beforeEach(function() {
        Configuration.session = 'session:custom';
        this.otherSession     = Session.extend().create({ store: this.store, container: this.container });
        this.containerStub.withArgs('session:custom').returns(this.otherSession);
      });

      it('is of that class', function() {
        setup(this.container, this.application);

        var spyCall = this.application.inject.getCall(0);
        expect(spyCall.args[2]).to.eql('session:custom');
      });
    });

    it('uses the LocalStorage store by default', function() {
      setup(this.container, this.application);

      expect(this.session.store).to.eql(this.store);
    });

    it('uses a custom store if specified', function() {
      Configuration.store = 'simple-auth-session-store:ephemeral';
      var store           = EphemeralStore.create();
      this.containerStub.withArgs('simple-auth-session-store:ephemeral').returns(store);
      setup(this.container, this.application);

      expect(this.session.store).to.eql(store);
    });

    it("uses the app's container", function() {
      setup(this.container, this.application);

      expect(this.session.container).to.eql(this.container);
    });

    it('is injected into all components, controllers and routes', function() {
      var _this = this;
      setup(this.container, this.application);

      ['component', 'controller', 'route'].forEach(function(component) {
        expect(_this.application.inject).to.have.been.calledWith(component, Configuration.sessionPropertyName, Configuration.session);
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

  describe('the AJAX prefilter', function() {
    context('when an authorizer is configured', function() {
      beforeEach(function() {
        Configuration.authorizer = 'authorizer';
      });

      it('uses the configured authorizer', function() {
        setup(this.container, this.application);
        Ember.$.get('/data');

        expect(this.authorizer.authorize).to.have.been.calledOnce;
      });

      it('does not authorize requests going to a foreign origin', function() {
        setup(this.container, this.application);
        Ember.$.get('http://other-domain.com');

        expect(this.authorizer.authorize).to.not.have.been.called;
      });

      it('authorizes requests going to a foreign origin if all other origins are whitelisted', function() {
          Configuration.crossOriginWhitelist = ['*'];
          setup(this.container, this.application);
          Ember.$.get('http://other-domain.com/path/query=string');

          expect(this.authorizer.authorize).to.have.been.calledOnce;

          Ember.$.get('http://other-domain.com:80/path/query=string');

          expect(this.authorizer.authorize).to.have.been.calledTwice;

          Ember.$.get('https://another-port.net:4567/path/query=string');

          expect(this.authorizer.authorize).to.have.been.calledThrice;
      });

      it('authorizes requests going to a foreign origin if the specific origin is whitelisted', function() {
        Configuration.crossOriginWhitelist = ['http://other-domain.com', 'https://another-port.net:4567'];
        setup(this.container, this.application);
        Ember.$.get('http://other-domain.com/path/query=string');

        expect(this.authorizer.authorize).to.have.been.calledOnce;

        Ember.$.get('http://other-domain.com:80/path/query=string');

        expect(this.authorizer.authorize).to.have.been.calledTwice;

        Ember.$.get('https://another-port.net:4567/path/query=string');

        expect(this.authorizer.authorize).to.have.been.calledThrice;
      });

      it('authorizes requests going to a subdomain of a foreign origin if the origin and any subdomain are whitelisted', function() {
        Configuration.crossOriginWhitelist = ['http://*.other-domain.com', 'http://*.sub.test-domain.com:1234'];
        setup(this.container, this.application);
        Ember.$.get('http://test.other-domain.com/path/query=string');

        expect(this.authorizer.authorize).to.have.been.calledOnce;

        Ember.$.get('http://another-test.other-domain.com/path/query=string');

        expect(this.authorizer.authorize).to.have.been.calledTwice;

        Ember.$.get('http://test2.other-domain.com/path/query=string');

        expect(this.authorizer.authorize).to.have.been.calledThrice;

        Ember.$.get('http://test2.other-domain.com:80/path/query=string');

        expect(this.authorizer.authorize).to.have.been.callCount(4);

        Ember.$.get('http://another-port.other-domain.com:1234/path/query=string');

        expect(this.authorizer.authorize).to.not.have.been.callCount(5);

        Ember.$.get('http://test2.sub.test-domain.com/path/query=string');

        expect(this.authorizer.authorize).to.not.have.been.callCount(5);

        Ember.$.get('http://wrong.test2.test-domain.com:1234/path/query=string');

        expect(this.authorizer.authorize).to.not.have.been.callCount(5);

        Ember.$.get('http://test2.sub.test-domain.com:1234/path/query=string');

        expect(this.authorizer.authorize).to.have.been.callCount(5);

        Ember.$.get('http://test2.sub.test-domain.com:1235/path/query=string');

        expect(this.authorizer.authorize).to.not.have.been.callCount(6);
      });

      afterEach(function() {
        this.authorizer.isDestroyed = false;
      });
    });
  });

  describe('the AJAX error handler', function() {
    beforeEach(function() {
      Configuration.authorizer = 'authorizer';
      this.xhr                 = sinon.useFakeXMLHttpRequest();
      this.server              = sinon.fakeServer.create();
      this.server.autoRespond  = true;
      setup(this.container, this.application);
    });

    describe("when the request's status is 401", function() {
      context('when the XHR was authorized by the authorizer', function() {
        beforeEach(function() {
          this.server.respondWith('GET', '/data', [401, {}, '']);
        });

        it("triggers the session's authorizationFailed event", function(done) {
          this.session.one('authorizationFailed', function() {
            expect(true).to.be.true;
            done();
          });

          Ember.$.get('/data');
        });
      });

      context('when the XHR was not authorized by the authorizer', function() {
        beforeEach(function() {
          this.server.respondWith('GET', 'http://other.origin/data', [401, {}, '']);
        });

        it("does not trigger the session's authorizationFailed event", function(done) {
          var triggered = false;
          this.session.one('authorizationFailed', function() { triggered = true; });
          // as this is a different origin that's not whitelisted the request will not be authorized
          Ember.$.get('http://other.origin/data');

          Ember.run.later(function() {
            expect(triggered).to.be.false;
            done();
          }, 100);
        });
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
    Configuration.load(this.container, {});
  });
});
