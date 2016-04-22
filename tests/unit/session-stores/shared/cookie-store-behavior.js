/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import FakeCookieService from '../../../helpers/fake-cookie-service';

const { run: { next } } = Ember;

export default function(options) {
  let store;
  let createStore;
  let renew;
  let sync;
  let cookieService;

  beforeEach(() => {
    createStore = options.createStore;
    renew = options.renew;
    sync = options.sync;
    cookieService = FakeCookieService.create();
    sinon.spy(cookieService, 'read');
    sinon.spy(cookieService, 'write');
    store = createStore(cookieService);
  });

  afterEach(() => {
    cookieService.read.restore();
    cookieService.write.restore();
    store.clear();
  });

  describe('#persist', function() {
    it('respects the configured cookieName', () => {
      store = createStore(cookieService, { cookieName: 'test:session' });
      store.persist({ key: 'value' });

      expect(cookieService.write).to.have.been.calledWith(
        'test:session',
        JSON.stringify({ key: 'value' }),
        { domain: null, expires: null, path: '/', secure: false }
      );
    });

    it('respects the configured cookieDomain', () => {
      store = createStore(cookieService, { cookieDomain: 'example.com' });
      store.persist({ key: 'value' });

      expect(cookieService.write).to.have.been.calledWith(
        'ember_simple_auth-session',
        JSON.stringify({ key: 'value' }),
        { domain: 'example.com', expires: null, path: '/', secure: false }
      );
    });
  });

  describe('#renew', () => {
    beforeEach((done) => {
      store = createStore(cookieService, {
        cookieName:           'test:session',
        cookieExpirationTime: 60,
        expires:              new Date().getTime() + store.cookieExpirationTime * 1000
      });
      store.persist({ key: 'value' });
      renew(store).then(done);
    });

    // TODO: the "…:expiration_time" never actually seems to get written
    it('stores the expiration time in a cookie named "test:session:expiration_time"');
  });

  describe('the "sessionDataUpdated" event', () => {
    let triggered;

    beforeEach(() => {
      triggered = false;
      store.persist({ key: 'value' });
      store.one('sessionDataUpdated', () => {
        triggered = true;
      });
    });

    it('is not triggered when the cookie has not actually changed', (done) => {
      document.cookie = 'ember_simple_auth-session=%7B%22key%22%3A%22value%22%7D;path=/;';
      sync(store);

      next(() => {
        expect(triggered).to.be.false;
        done();
      });
    });

    it('is triggered when the cookie changed', (done) => {
      const cookiesService = store.get('_cookies') || store.get('_store._cookies');
      cookiesService._content['ember_simple_auth-session'] = '%7B%22key%22%3A%22other%20value%22%7D';
      sync(store);

      next(() => {
        next(() => {
          expect(triggered).to.be.true;
          done();
        });
      });
    });

    it('is not triggered when the cookie expiration was renewed', (done) => {
      renew(store, { key: 'value' });
      sync(store);

      next(() => {
        expect(triggered).to.be.false;
        done();
      });
    });
  });
}
