/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import setupSessionRestoration from 'ember-simple-auth/instance-initializers/setup-session-restoration';

const { Route, RSVP } = Ember;

describe('setupSessionRestoration', () => {
  let container;
  let containerStub;
  let route;

  beforeEach(() => {
    container = {
      lookup() {}
    };

    route = Route.extend().create();

    containerStub = sinon.stub(container, 'lookup');
  });

  it('adds a beforeModel method', () => {
    containerStub.withArgs('route:application').returns(route);
    setupSessionRestoration({ container });

    expect(route).to.respondTo('beforeModel');
  });

  describe('the beforeModel method', () => {
    let session;

    beforeEach(() => {
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

    describe('when session restoration resolves', () => {
      beforeEach(() => {
        sinon.stub(session, 'restore').returns(RSVP.resolve());
      });

      it('returns the return value of the original "beforeModel" method', () => {
        return route.beforeModel().then((value) => {
          expect(value).to.eq('test');
        });
      });
    });

    describe('when session restoration rejects', () => {
      beforeEach(() => {
        sinon.stub(session, 'restore').returns(RSVP.reject());
      });

      it('returns the return value of the original "beforeModel" method', () => {
        return route.beforeModel().then((value) => {
          expect(value).to.eq('test');
        });
      });
    });
  });
});
