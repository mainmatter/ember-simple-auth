/* eslint-disable mocha/no-top-level-hooks */

import Ember from 'ember';
import { describe, beforeEach, afterEach, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import FakeCookieService from '../../../helpers/fake-cookie-service';

const { run, run: { next } } = Ember;

export default function(options) {
  let store;
  let createStore;
  let renew;
  let sync;
  let cookieService;
  let spyRewriteCookieMethod;

  beforeEach(function() {
    createStore = options.createStore;
    renew = options.renew;
    sync = options.sync;
    cookieService = FakeCookieService.create();
    sinon.spy(cookieService, 'read');
    sinon.spy(cookieService, 'write');
    store = createStore(cookieService);
    spyRewriteCookieMethod = options.spyRewriteCookieMethod;
  });

  afterEach(function() {
    cookieService.read.restore();
    cookieService.write.restore();
    store.clear();
  });

  describe('#persist', function() {
    beforeEach(function() {
      sinon.spy(Ember, 'warn');
    });

    afterEach(function() {
      // eslint-disable-next-line ember/local-modules
      Ember.warn.restore();
    });

    it('respects the configured cookieName', function() {
      let store;
      run(() => {
        store = createStore(cookieService, { cookieName: 'test-session' });
      });
      store.persist({ key: 'value' });

      expect(cookieService.write).to.have.been.calledWith(
        'test-session',
        JSON.stringify({ key: 'value' }),
        { domain: null, expires: null, path: '/', secure: false }
      );
    });

    it('respects the configured cookieDomain', function() {
      let store;
      run(() => {
        store = createStore(cookieService, {
          cookieName: 'session-cookie-domain',
          cookieDomain: 'example.com'
        });
        store.persist({ key: 'value' });
      });

      expect(cookieService.write).to.have.been.calledWith(
        'session-cookie-domain',
        JSON.stringify({ key: 'value' }),
        { domain: 'example.com', expires: null, path: '/', secure: false }
      );
    });

    it('sends a warning when `cookieExpirationTime` is less than 90 seconds', function(done) {
      run(() => {
        createStore(cookieService, {
          cookieName: 'session-cookie-domain',
          cookieDomain: 'example.com',
          cookieExpirationTime: 60
        });

        expect(Ember.warn).to.have.been.calledWith('The recommended minimum value for `cookieExpirationTime` is 90 seconds. If your value is less than that, the cookie may expire before its expiration time is extended (expiration time is extended every 60 seconds).');

        done();
      });
    });
  });

  describe('#renew', function() {
    let now = new Date();

    beforeEach(function(done) {
      store = createStore(cookieService, {
        cookieName:           'test-session',
        cookieExpirationTime: 60
      });
      store.persist({ key: 'value' });
      renew(store).then(done);
    });

    it('stores the expiration time in a cookie named "test-session-expiration_time"', function() {
      expect(cookieService.write).to.have.been.calledWith(
        'test-session-expiration_time',
        60,
        sinon.match(function({ domain, expires, path, secure }) {
          return domain === null &&
            path === '/' &&
            secure === false && expires >= new Date(now.getTime() + 60 * 1000);
        })
      );
    });
  });

  describe('the "sessionDataUpdated" event', function() {
    let triggered;

    beforeEach(function() {
      triggered = false;
      store.persist({ key: 'value' });
      store.one('sessionDataUpdated', () => {
        triggered = true;
      });
    });

    it('is not triggered when the cookie has not actually changed', function(done) {
      document.cookie = 'ember_simple_auth-session=%7B%22key%22%3A%22value%22%7D;path=/;';
      sync(store);

      next(() => {
        expect(triggered).to.be.false;
        done();
      });
    });

    it('is triggered when the cookie changed', function(done) {
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

    it('is not triggered when the cookie expiration was renewed', function(done) {
      renew(store, { key: 'value' });
      sync(store);

      next(() => {
        expect(triggered).to.be.false;
        done();
      });
    });
  });

  describe('rewrite behavior', function() {
    let store;
    let cookieSpy;
    let cookieService;
    let now = new Date();

    beforeEach(function() {
      cookieService = FakeCookieService.create();
      store = createStore(cookieService, {
        cookieName: 'session-foo',
        cookieExpirationTime: 1000
      });
      cookieService = store.get('_cookies') || store.get('_store._cookies');
      cookieSpy = spyRewriteCookieMethod(store);
      sinon.spy(cookieService, 'write');
      sinon.spy(cookieService, 'clear');
    });

    afterEach(function() {
      cookieService.write.restore();
      cookieService.clear.restore();
      cookieSpy.restore();
    });

    it('deletes the old cookie and writes a new one when name property changes', function() {
      run(() => {
        store.persist({ key: 'value' });
        store.set('cookieName', 'session-bar');
      });

      expect(cookieService.clear).to.have.been.calledWith('session-foo');

      expect(cookieService.clear).to.have.been.calledWith('session-foo-expiration_time');

      expect(cookieService.write).to.have.been.calledWith(
        'session-bar',
        JSON.stringify({ key: 'value' }),
        sinon.match(function({ domain, expires, path, secure }) {
          return domain === null &&
            path === '/' &&
            secure === false &&
            expires >= new Date(now.getTime() + 1000 * 1000);
        })
      );

      expect(cookieService.write).to.have.been.calledWith(
        'session-bar-expiration_time',
        1000,
        sinon.match(function({ domain, expires, path, secure }) {
          return domain === null &&
            path === '/' &&
            secure === false &&
            expires >= new Date(now.getTime() + 1000 * 1000);
        })
      );
    });

    it('only rewrites the cookie once per run loop when multiple properties are changed', function(done) {
      run(() => {
        store.set('cookieName', 'session-bar');
        store.set('cookieExpirationTime', 10000);
      });

      next(() => {
        expect(cookieSpy).to.have.been.called.once;
        done();
      });
    });
  });
}
