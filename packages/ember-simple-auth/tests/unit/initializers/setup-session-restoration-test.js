import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { setupTest } from 'ember-mocha';
import RSVP from 'rsvp';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinonjs from 'sinon';
import setupSessionRestoration from 'ember-simple-auth/initializers/setup-session-restoration';

describe('setupSessionRestoration', () => {
  setupTest();

  let sinon;

  beforeEach(function() {
    sinon = sinonjs.createSandbox();

    this.owner.register('route:application', Route.extend());
  });

  afterEach(function() {
    sinon.restore();
  });

  it('adds a beforeModel method', function() {
    setupSessionRestoration(this.owner);

    const route = this.owner.lookup('route:application');
    expect(route).to.respondTo('beforeModel');
  });

  describe('the beforeModel method', function() {
    let session;
    let route;

    beforeEach(function() {
      this.owner.register('session:main', EmberObject.extend({
        restore() {}
      }));
      session = this.owner.lookup('session:main');

      this.owner.register('route:application', Route.extend({
        beforeModel() {
          return RSVP.resolve('test');
        }
      }));
      route = this.owner.lookup('route:application');

      setupSessionRestoration(this.owner);
    });

    describe('when session restoration resolves', function() {
      beforeEach(function() {
        sinon.stub(session, 'restore').returns(RSVP.resolve());
      });

      it('returns the return value of the original "beforeModel" method', async function() {
        let value = await route.beforeModel();

        expect(value).to.eq('test');
      });
    });

    describe('when session restoration rejects', function() {
      beforeEach(function() {
        sinon.stub(session, 'restore').returns(RSVP.reject());
      });

      it('returns the return value of the original "beforeModel" method', async function() {
        let value = await route.beforeModel();

        expect(value).to.eq('test');
      });
    });
  });
});
