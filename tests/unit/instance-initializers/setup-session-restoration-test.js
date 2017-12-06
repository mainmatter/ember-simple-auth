import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import setupSessionRestoration from 'ember-simple-auth/instance-initializers/setup-session-restoration';

describe('setupSessionRestoration', () => {
  let container;
  let containerStub;
  let route;

  beforeEach(function() {
    container = {
      lookup() {}
    };

    route = Route.extend().create();

    containerStub = sinon.stub(container, 'lookup');
  });

  it('adds a beforeModel method', function() {
    containerStub.withArgs('route:application').returns(route);
    setupSessionRestoration({ container });

    expect(route).to.respondTo('beforeModel');
  });

  describe('the beforeModel method', function() {
    let session;

    beforeEach(function() {
      session = {
        restore() {}
      };

      route = Route.extend({
        beforeModel() {
          return RSVP.resolve('test');
        }
      }).create();

      containerStub.withArgs('route:application').returns(route);
      containerStub.withArgs('session:main').returns(session);
      setupSessionRestoration({ container });
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
