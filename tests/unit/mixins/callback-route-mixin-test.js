/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import CallbackRouteMixin from 'ember-simple-auth/mixins/callback-route-mixin';

const { Object: EmberObject, RSVP, Route } = Ember;

describe('CallbackRouteMixin', () => {
  let route;
  let session;
  let ok;

  describe('#activate', () => {
    beforeEach(() => {
      session = EmberObject.extend({
        authenticate() {
          if (ok) {
            return RSVP.resolve();
          } else {
            return RSVP.reject('access_denied');
          }
        }
      }).create();

      sinon.spy(session, 'authenticate');

      route = Route.extend(CallbackRouteMixin, {
        authenticator: 'authenticator:oauth2'
      }).create({ session });

      sinon.spy(route, 'transitionTo');
    });

    it('should save the error and transition if authentication fails', (done) => {
      ok = false;

      route.activate();
      setTimeout(() => {
        expect(route.error).to.eq('access_denied');
        expect(session.authenticate).to.have.been.calledWith('authenticator:oauth2');
        done();
      }, 10);
    });
  });
});
