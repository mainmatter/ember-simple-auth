/* eslint-disable ember/no-mixins, ember/no-new-mixins */

import Mixin from '@ember/object/mixin';
import { setOwner } from '@ember/application';
import RSVP from 'rsvp';
import Route from '@ember/routing/route';
import Service from '@ember/service';
import { describe, beforeEach, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import { expect } from 'chai';
import sinonjs from 'sinon';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

describe('AuthenticatedRouteMixin', () => {
  setupTest();

  let sinon;
  let route;
  let router;
  let transition;

  beforeEach(function() {
    sinon = sinonjs.createSandbox();
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('#beforeModel', function() {
    beforeEach(function() {
      const MixinImplementingBeforeModel = Mixin.create({
        beforeModel() {
          return RSVP.resolve('upstreamReturnValue');
        }
      });

      transition = {
        intent: {
          url: '/transition/target/url'
        },
        send() {}
      };
      this.owner.register('service:router', Service.extend({
        transitionTo() {}
      }));
      router = this.owner.lookup('service:router');

      this.owner.register('service:session', Service.extend());

      route = Route.extend(MixinImplementingBeforeModel, AuthenticatedRouteMixin).create();
      setOwner(route, this.owner);

      sinon.spy(transition, 'send');
      sinon.spy(router, 'transitionTo');
    });

    describe('if the session is authenticated', function() {
      beforeEach(function() {
        let session = this.owner.lookup('service:session');
        session.set('isAuthenticated', true);
      });

      it('returns the upstream promise', async function() {
        let result = await route.beforeModel(transition);

        expect(result).to.equal('upstreamReturnValue');
      });

      it('does not transition to the authentication route', function() {
        route.beforeModel(transition);

        expect(router.transitionTo).to.not.have.been.calledWith('login');
      });
    });

    describe('if the session is not authenticated', function() {
      it('does not return the upstream promise', function() {
        expect(route.beforeModel(transition)).to.be.undefined;
      });

      it('transitions to "login" as the default authentication route', function() {
        route.beforeModel(transition);
        expect(router.transitionTo).to.have.been.calledWith('login');
      });

      it('transitions to the set authentication route', function() {
        let authenticationRoute = 'path/to/route';
        route.set('authenticationRoute', authenticationRoute);

        route.beforeModel(transition);
        expect(router.transitionTo).to.have.been.calledWith(authenticationRoute);
      });

      it('sets the redirectTarget cookie in fastboot', function() {
        this.owner.register('service:fastboot', Service.extend({
          isFastBoot: true,
          init() {
            this._super(...arguments);
            this.request = {
              protocol: 'https'
            };
          },
        }));
        let writeCookieStub = sinon.stub();
        this.owner.register('service:cookies', Service.extend({
          write: writeCookieStub
        }));

        let cookieName = 'ember_simple_auth-redirectTarget';

        route.beforeModel(transition);
        expect(writeCookieStub).to.have.been.calledWith(cookieName, transition.intent.url, {
          path: '/',
          secure: true
        });
      });
    });
  });
});
