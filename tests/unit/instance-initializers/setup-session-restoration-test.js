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
      lookup() {},
      register() {}
    };

    const Route = Ember.Route.extend();
    route = Route.create();

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

      const Route = Ember.Route.extend({
        beforeModel() {
          return Ember.RSVP.resolve('test');
        }
      });
      route = Route.create();

      containerStub.withArgs('route:application').returns(route);
      containerStub.withArgs('session:main').returns(session);
      setupSessionRestoration({ container });
    });

    describe('when session restoration resolves', () => {
      beforeEach(() => {
        sinon.stub(session, 'restore').returns(Ember.RSVP.resolve());
      });

      it('returns the return value of the original "beforeModel" method', () => {
        return route.beforeModel().then((value) => {
          expect(value).to.eq('test');
        });
      });
    });

    describe('when session restoration rejects', () => {
      beforeEach(() => {
        sinon.stub(session, 'restore').returns(Ember.RSVP.reject());
      });

      it('returns the return value of the original "beforeModel" method', () => {
        return route.beforeModel().then((value) => {
          expect(value).to.eq('test');
        });
      });
    });
  });

  describe('when no application route is defined', () => {
    it('registers one', () => {
      sinon.spy(container, 'register');
      setupSessionRestoration({ container });

      expect(container.register).to.have.been.calledWith('route:application'/* not sure how to expect that second argument is a "function (subclass of Ember.Route)…" */);
    });
  });
});
