import EmberObject from '@ember/object';
import RSVP from 'rsvp';
import Route from '@ember/routing/route';
import { isEmpty } from '@ember/utils';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import OAuth2ImplicitGrantCallbackRouteMixin from 'ember-simple-auth/mixins/oauth2-implicit-grant-callback-route-mixin';

describe('OAuth2ImplicitGrantCallbackRouteMixin', function() {
  let route;
  let session;

  describe('#activate', function() {
    beforeEach(function() {
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

    it('correctly passes the auth parameters if authentication succeeds', function(done) {
      // it isn't possible to stub window.location.hash so we stub a wrapper function instead
      sinon.stub(route, '_windowLocationHash').returns('#/routepath#access_token=secret-token');

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
