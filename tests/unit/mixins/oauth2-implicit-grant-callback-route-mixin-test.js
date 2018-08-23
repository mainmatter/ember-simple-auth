import EmberObject from '@ember/object';
import RSVP from 'rsvp';
import Route from '@ember/routing/route';
import { isEmpty } from '@ember/utils';
import { it } from 'ember-mocha';
import { describe, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import sinonjs from 'sinon';
import OAuth2ImplicitGrantCallbackRouteMixin from 'ember-simple-auth/mixins/oauth2-implicit-grant-callback-route-mixin';
import * as LocationUtil from 'ember-simple-auth/utils/location';

describe('OAuth2ImplicitGrantCallbackRouteMixin', function() {
  let route;
  let session;

  describe('#activate', function() {
    let sinon;
    beforeEach(function() {
      sinon = sinonjs.sandbox.create();
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

      sinon.spy(route, 'transitionTo');
    });
    afterEach(function() {
      sinon.restore();
    });

    it('correctly passes the auth parameters if authentication succeeds', function(done) {
      // it isn't possible to stub window.location.hash so we stub a wrapper function instead
      sinon.stub(LocationUtil, 'default').returns({ hash: '#/routepath#access_token=secret-token' });

      route.activate();
      setTimeout(() => {
        expect(session.authenticate).to.have.been.calledWith('authenticator:oauth2', { access_token: 'secret-token' });
        done();
      }, 10);
    });

    it('saves the error and transition if authentication fails', function(done) {
      route.activate();
      setTimeout(() => {
        expect(route.error).to.eq('access_denied');
        expect(session.authenticate).to.have.been.calledWith('authenticator:oauth2');
        done();
      }, 10);
    });
  });
});
