/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import setupSessionRestoration from 'ember-simple-auth/instance-initializers/setup-session-restoration';

let container;
let containerStub;
let route;

describe('setupSessionRestoration', () => {
  beforeEach(() => {
    container = {
      lookup() {}
    };

    const Route = Ember.Object.extend();
    route = Route.create();

    containerStub = sinon.stub(container, 'lookup');
    containerStub.withArgs('route:application').returns(route);
  });

  it('adds a beforeModel method', () => {
    setupSessionRestoration({ container });

    expect(route).to.respondTo('beforeModel');
  });

  describe('the beforeModel method', () => {
    let session;

    beforeEach(() => {
      session = {
        restore() {}
      };

      const BaseRoute = Ember.Object.extend({
        beforeModel() {
          return Ember.RSVP.resolve('test');
        }
      });
      const Route = BaseRoute.extend();
      route = Route.create();

      containerStub.withArgs('session:main').returns(session);
      setupSessionRestoration({ container });
    });

    describe('when session restoration resolves', () => {
      beforeEach(() => {
        sinon.stub(session, 'restore').returns(Ember.RSVP.resolve());
      });

      it('returns the return value of _super', () => {
        return route.beforeModel().then((value) => {
          expect(value).to.eq('test');
        });
      });
    });

    describe('when session restoration rejects', () => {
      beforeEach(() => {
        sinon.stub(session, 'restore').returns(Ember.RSVP.reject());
      });

      it('returns the return value of _super', () => {
        return route.beforeModel().then((value) => {
          expect(value).to.eq('test');
        });
      });
    });
  });
});
