/* jshint expr:true */
import { it } from 'ember-mocha';
import Ember from 'ember';
import { default as setup, inject, register } from 'ember-simple-auth/setup';
import Configuration from 'ember-simple-auth/configuration';
import Session from 'ember-simple-auth/session';
import LocalStorageStore from 'ember-simple-auth/stores/local-storage';
import EphemeralStore from 'ember-simple-auth/stores/ephemeral';

let application;
let container;
let session;
let authorizer;
let lookupStub;

describe('setup', () => {
  beforeEach(() => {
    application = {
      register() {},
      inject() {},
      deferReadiness() {},
      advanceReadiness() {}
    };
    container          = {
      lookup() {}
    };
    session            = Session.create();
    lookupStub         = sinon.stub(container, 'lookup');
    let router         = {
      get() {
        return 'rootURL';
      },
      send() {}
    };
    let store          = LocalStorageStore.create();
    authorizer         = {
      set() {},
      authorize() {}
    };
    session.setProperties({ store, container });

    lookupStub.withArgs('router:main').returns(router);
    lookupStub.withArgs('simple-auth-session-store:local-storage').returns(store);
    lookupStub.withArgs('simple-auth-session:main').returns(session);
    lookupStub.withArgs('authorizer').returns(authorizer);

    sinon.spy(application, 'register');
    sinon.spy(application, 'inject');
  });

  afterEach(() => {
    Configuration.load(container, {});
  });

  it('registers the LocalStorage store', () => {
    register(application);

    expect(application.register).to.have.been.calledWith('simple-auth-session-store:local-storage', LocalStorageStore);
  });

  it('registers the Ephemeral store', () => {
    register(application);

    expect(application.register).to.have.been.calledWith('simple-auth-session-store:ephemeral', EphemeralStore);
  });

  it('registers the Session', () => {
    register(application);

    expect(application.register).to.have.been.calledWith('simple-auth-session:main', Session);
  });

  describe('the session instance', () => {
    beforeEach(() => {
      Configuration.base.store = 'simple-auth-session-store:local-storage';
    });

    context('when a custom session class is configured', () => {
      beforeEach(() => {
        Configuration.base.session = 'session:custom';
        let store                  = EphemeralStore.create();
        let otherSession           = Session.extend().create({ store, container });
        lookupStub.withArgs('session:custom').returns(otherSession);
      });

      it('is of that class', () => {
        setup(container);
        inject(application);

        let spyCall = application.inject.getCall(0);
        expect(spyCall.args[2]).to.eql('session:custom');
      });
    });

    it('uses the LocalStorage store by default', () => {
      setup(container);

      expect(session.store).to.be.an.instanceof(LocalStorageStore);
    });

    it('uses a custom store if specified', () => {
      Configuration.base.store = 'simple-auth-session-store:ephemeral';
      let store                = EphemeralStore.create();
      lookupStub.withArgs('simple-auth-session-store:ephemeral').returns(store);
      setup(container);

      expect(session.store).to.be.an.instanceof(EphemeralStore);
    });

    it("uses the app's container", () => {
      setup(container);

      expect(session.container).to.eql(container);
    });

    it('is injected into all components, controllers and routes', () => {
      inject(application);

      ['component', 'controller', 'route'].forEach((component) => {
        expect(application.inject).to.have.been.calledWith(component, Configuration.base.sessionPropertyName, Configuration.base.session);
      });
    });

    it("sets applicationRootUrl to the application's root URL", () => {
      setup(container);

      expect(Configuration.base.applicationRootUrl).to.eql('rootURL');
    });
  });

  describe('the AJAX prefilter', () => {
    beforeEach(() => {
      sinon.spy(authorizer, 'authorize');
    });

    context('when an authorizer is configured', () => {
      beforeEach(() => {
        Configuration.base.authorizer = 'authorizer';
      });

      it('uses the configured authorizer', () => {
        setup(container);
        Ember.$.get('/data');

        expect(authorizer.authorize).to.have.been.calledOnce;
      });

      it('does not authorize requests going to a foreign origin', () => {
        setup(container);
        Ember.$.get('http://other-domain.com');

        expect(authorizer.authorize).to.not.have.been.called;
      });

      it('authorizes requests going to a foreign origin if all other origins are whitelisted', () => {
        Configuration.base.crossOriginWhitelist = ['*'];
        setup(container);
        Ember.$.get('http://other-domain.com/path/query=string');

        expect(authorizer.authorize).to.have.been.calledOnce;

        Ember.$.get('http://other-domain.com:80/path/query=string');

        expect(authorizer.authorize).to.have.been.calledTwice;

        Ember.$.get('https://another-port.net:4567/path/query=string');

        expect(authorizer.authorize).to.have.been.calledThrice;
      });

      it('authorizes requests going to a foreign origin if the specific origin is whitelisted', () => {
        Configuration.base.crossOriginWhitelist = ['http://other-domain.com', 'https://another-port.net:4567'];
        setup(container);
        Ember.$.get('http://other-domain.com/path/query=string');

        expect(authorizer.authorize).to.have.been.calledOnce;

        Ember.$.get('http://other-domain.com:80/path/query=string');

        expect(authorizer.authorize).to.have.been.calledTwice;

        Ember.$.get('https://another-port.net:4567/path/query=string');

        expect(authorizer.authorize).to.have.been.calledThrice;
      });

      it('authorizes requests going to a subdomain of a foreign origin if the origin and any subdomain are whitelisted', () => {
        Configuration.base.crossOriginWhitelist = ['http://*.other-domain.com', 'http://*.sub.test-domain.com:1234'];
        setup(container);
        Ember.$.get('http://test.other-domain.com/path/query=string');

        expect(authorizer.authorize).to.have.been.calledOnce;

        Ember.$.get('http://another-test.other-domain.com/path/query=string');

        expect(authorizer.authorize).to.have.been.calledTwice;

        Ember.$.get('http://test2.other-domain.com/path/query=string');

        expect(authorizer.authorize).to.have.been.calledThrice;

        Ember.$.get('http://test2.other-domain.com:80/path/query=string');

        expect(authorizer.authorize).to.have.been.callCount(4);

        Ember.$.get('http://another-port.other-domain.com:1234/path/query=string');

        expect(authorizer.authorize).to.not.have.been.callCount(5);

        Ember.$.get('http://test2.sub.test-domain.com/path/query=string');

        expect(authorizer.authorize).to.not.have.been.callCount(5);

        Ember.$.get('http://wrong.test2.test-domain.com:1234/path/query=string');

        expect(authorizer.authorize).to.not.have.been.callCount(5);

        Ember.$.get('http://test2.sub.test-domain.com:1234/path/query=string');

        expect(authorizer.authorize).to.have.been.callCount(5);

        Ember.$.get('http://test2.sub.test-domain.com:1235/path/query=string');

        expect(authorizer.authorize).to.not.have.been.callCount(6);
      });
    });
  });

  describe('the AJAX error handler', () => {
    let xhr;
    let server;

    beforeEach(() => {
      Configuration.base.authorizer = 'authorizer';
      xhr                           = sinon.useFakeXMLHttpRequest();
      server                        = sinon.fakeServer.create();
      server.autoRespond            = true;
      setup(container);
    });

    afterEach(() => xhr.restore());

    describe("when the request's status is 401", () => {
      context('when the XHR was authorized by the authorizer', () => {
        beforeEach(() => {
          server.respondWith('GET', '/data', [401, {}, '']);
        });

        it("triggers the session's authorizationFailed event", (done) => {
          session.one('authorizationFailed', () => {
            expect(true).to.be.true;
            done();
          });

          Ember.$.get('/data');
        });
      });

      context('when the XHR was not authorized by the authorizer', () => {
        beforeEach(() => {
          server.respondWith('GET', 'http://other.origin/data', [401, {}, '']);
        });

        it("does not trigger the session's authorizationFailed event", (done) => {
          let triggered = false;
          session.one('authorizationFailed', () => triggered = true);
          // as this is a different origin that's not whitelisted the request will not be authorized
          Ember.$.get('http://other.origin/data');

          Ember.run.later(() => {
            expect(triggered).to.be.false;
            done();
          }, 100);
        });
      });
    });

    describe("when the request's status is not 401", () => {
      beforeEach(() => {
        server.respondWith('GET', '/data', [500, {}, '']);
      });

      it("does not trigger the session's authorizationFailed event", (done) => {
        let triggered = false;
        session.one('authorizationFailed', () => triggered = true);
        Ember.$.get('/data');

        Ember.run.next(() => {
          expect(triggered).to.be.false;
          done();
        }, 100);
      });
    });
  });
});
