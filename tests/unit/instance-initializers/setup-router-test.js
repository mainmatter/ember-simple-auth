import Ember from 'ember';
// import { initialize } from 'dummy/instance-initializers/setup-router';
// import destroyApp from '../../helpers/destroy-app';
import { it } from 'ember-mocha';
import { describe, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';

describe('initialize from extending router', () => {
  let Router;

  beforeEach(() => {
    // const FakeMixin = Ember.Mixin.create({
    //   'foo': 'bar'
    // });
    //
    // UnauthenticatedRouteMixin = sinon.stub().returns(FakeMixin);

    // initialize();
  });

  afterEach(() => {
    Router = null;
  });

  it('adds an `unathenticatedRoute` method to router', () => {
    let unauthenticatedRouteMethod = null;
    Router = Ember.Router.extend({});
    Router.map(function() {
      unauthenticatedRouteMethod = this.unauthenticatedRoute;
    });
    let router = Router.create();
    router._initRouterJs();
    expect(typeof unauthenticatedRouteMethod).to.eq('function');
  });

  describe('`unauthenticatedRoute`', () => {
    it('just calls route', () => {
      let routeSpy = sinon.spy();
      Router = Ember.Router.extend({});
      Router.map(function() {
        this.route = routeSpy;
        this.unauthenticatedRoute('test');
      });
      let router = Router.create();
      router._initRouterJs();
      expect(routeSpy.called).to.eql(true);
    });

    it('registers all routers', () => {
      Router = Ember.Router.extend({});
      Router.map(function() {
        this.route('test0');
        this.unauthenticatedRoute('test1');
        this.unauthenticatedRoute('test2');
      });
      let router = Router.create();
      router._initRouterJs();

      expect(router.router.unauthenticatedRoutes).not.to.include('test0');
      expect(router.router.unauthenticatedRoutes).to.include('test1');
      expect(router.router.unauthenticatedRoutes).to.include('test2');

      expect(router.router.recognizer.names).to.have.property('test0');
      expect(router.router.recognizer.names).to.have.property('test1');
      expect(router.router.recognizer.names).to.have.property('test2');
    });

    // it('adds the correct mixin', () => {
    //   Router = Ember.Router.extend({});
    //   Router.map(function() {
    //     this.unauthenticatedRoute('test');
    //   });
    //   let router = Router.create();
    //   router._initRouterJs();
    //
    //   const container = {
    //     lookup() {}
    //   };
    //
    //   container.get = sinon.stub().withArgs('router').returns(router);
    //
    //   initialize(container);
    //   router.trigger('willTransition');
    //   // lookup route
    //   // check for mixin
    //
    // });
  });
});
