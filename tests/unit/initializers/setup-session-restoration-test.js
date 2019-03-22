import Route from '@ember/routing/route';
import { getOwner, setOwner } from '@ember/application';
import RSVP from 'rsvp';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinonjs from 'sinon';
import setupSessionRestoration from 'ember-simple-auth/initializers/setup-session-restoration';

describe('setupSessionRestoration', () => {
  let sinon;
  let registry;
  let resolveStub;
  let ApplicationRoute;

  beforeEach(function() {
    sinon = sinonjs.sandbox.create();
    registry = {
      resolve() {}
    };

    ApplicationRoute = Route.extend();

    resolveStub = sinon.stub(registry, 'resolve');
  });

  afterEach(function() {
    sinon.restore();
  });

  it('adds a beforeModel method', function() {
    resolveStub.withArgs('route:application').returns(ApplicationRoute);
    setupSessionRestoration(registry);

    const route = ApplicationRoute.create();
    expect(route).to.respondTo('beforeModel');
  });

  describe('the beforeModel method', function() {
    let session, route;

    beforeEach(function() {
      session = {
        restore() {}
      };

      ApplicationRoute = Route.extend({
        beforeModel() {
          return RSVP.resolve('test');
        }
      });

      resolveStub.withArgs('route:application').returns(ApplicationRoute);
      setupSessionRestoration(registry);

      route = ApplicationRoute.create({ container: {} });

      if (setOwner) {
        setOwner(route, { lookup() {} });
      }

      const owner = getOwner(route);
      sinon.stub(owner, 'lookup').withArgs('session:main').returns(session);
    });

    describe('when session restoration resolves', function() {
      beforeEach(function() {
        sinon.stub(session, 'restore').returns(RSVP.resolve());
      });

      it('returns the return value of the original "beforeModel" method', function() {
        return route.beforeModel().then((value) => {
          expect(value).to.eq('test');
        });
      });
    });

    describe('when session restoration rejects', function() {
      beforeEach(function() {
        sinon.stub(session, 'restore').returns(RSVP.reject());
      });

      it('returns the return value of the original "beforeModel" method', function() {
        return route.beforeModel().then((value) => {
          expect(value).to.eq('test');
        });
      });
    });
  });
});
