/* eslint-disable ember/no-mixins, ember/no-new-mixins */

import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import EmberObject from '@ember/object';
import RSVP from 'rsvp';
import Route from '@ember/routing/route';
import { isEmpty } from '@ember/utils';
import { setOwner } from '@ember/application';
import sinonjs from 'sinon';
import OAuth2ImplicitGrantCallbackRouteMixin from 'ember-simple-auth/mixins/oauth2-implicit-grant-callback-route-mixin';
import * as LocationUtil from 'ember-simple-auth/utils/location';

module('OAuth2ImplicitGrantCallbackRouteMixin', function(hooks) {
  setupTest(hooks);

  let sinon;
  let route;
  let session;

  hooks.beforeEach(function() {
    sinon = sinonjs.createSandbox();
  });

  hooks.afterEach(function() {
    sinon.restore();
  });

  module('#activate', function(hooks) {
    hooks.beforeEach(function() {
      session = EmberObject.extend({
        authenticate(authenticator, hash) {
          if (!isEmpty(hash.access_token)) {
            return RSVP.resolve();
          } else {
            return RSVP.reject('access_denied');
          }
        }
      }).create();

      sinon.spy(session, 'authenticate');

      route = Route.extend(OAuth2ImplicitGrantCallbackRouteMixin, {
        authenticator: 'authenticator:oauth2',
        _isFastBoot: false
      }).create({ session });
      setOwner(route, this.owner);

      sinon.spy(route, 'transitionTo');
    });

    test('correctly passes the auth parameters if authentication succeeds', async function(assert) {
      assert.expect(1);
      // it isn't possible to stub window.location.hash so we stub a wrapper function instead
      sinon.stub(LocationUtil, 'default').returns({ hash: '#/routepath#access_token=secret-token' });

      route.activate();
      await new Promise(resolve => {
        setTimeout(() => {
          assert.ok(session.authenticate.calledWith('authenticator:oauth2', { access_token: 'secret-token' }));
          resolve();
        }, 10);
      });
    });

    test('saves the error and transition if authentication fails', async function(assert) {
      assert.expect(2);
      route.activate();
      await new Promise(resolve => {
        setTimeout(() => {
          assert.equal(route.error, 'access_denied');
          assert.ok(session.authenticate.calledWith('authenticator:oauth2'));
          resolve();
        }, 10);
      });
    });
  });
});
