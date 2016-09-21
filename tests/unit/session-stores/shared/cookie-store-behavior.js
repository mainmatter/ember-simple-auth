/* jshint expr:true */
import Ember from 'ember';
import { it } from 'ember-mocha';
import { describe, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';

const { run, run: { next } } = Ember;

export default function(options) {
  let store;
  let createStore;
  let renew;
  let sync;
  let spyRewriteCookieMethod;
  let unspyRewriteCookieMethod;

  beforeEach(() => {
    createStore = options.createStore;
    renew = options.renew;
    sync = options.sync;
    spyRewriteCookieMethod = options.spyRewriteCookieMethod;
    unspyRewriteCookieMethod = options.unspyRewriteCookieMethod;
    store = createStore();
  });

  afterEach(() => {
    store.clear();
  });

  describe('#persist', () => {
    it('respects the configured cookieName', () => {
      let store;
      run(() => {
        store = createStore({ cookieName: 'test-session' });
      });
      store.persist({ key: 'value' });

      expect(document.cookie).to.contain('test-session=%7B%22key%22%3A%22value%22%7D');
    });

    it('respects the configured cookieDomain', () => {
      let store;
      run(() => {
        store = createStore({
          cookieName: 'session-cookie-domain',
          cookieDomain: 'example.com'
        });
        store.persist({ key: 'value' });
      });

      expect(document.cookie).to.not.contain('session-cookie-domain=%7B%22key%22%3A%22value%22%7D');
    });
  });

  describe('#renew', () => {
    beforeEach(() => {
      store = createStore({
        cookieName:           'test-session',
        cookieExpirationTime: 60,
        expires:              new Date().getTime() + store.get('cookieExpirationTime') * 1000
      });
      store.persist({ key: 'value' });
      renew(store);
    });

    it('stores the expiration time in a cookie named "test-session-expiration_time"', () => {
      expect(document.cookie).to.contain('test-session-expiration_time=60');
    });
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
      document.cookie = 'ember_simple_auth-session=%7B%22key%22%3A%22other%20value%22%7D;path=/;';
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

  describe('rewrite behavior', () => {
    let store;
    let cookieSpy;

    beforeEach(() => {
      store = createStore({
        cookieName: 'session-foo',
        cookieExpirationTime: 1000
      });
      cookieSpy = spyRewriteCookieMethod(store);
    });

    afterEach(() => {
      cookieSpy.restore();
    });

    it('deletes the old cookie and writes a new one when name property changes', (done) => {
      run(() => {
        store.persist({ key: 'value' });
        store.set('cookieName', 'session-bar');
      });

      next(() => {
        expect(document.cookie).to.not.contain('session-foo=');
        expect(document.cookie).to.not.contain('session-foo-expiration_time=');
        expect(document.cookie).to.contain('session-bar=%7B%22key%22%3A%22value%22%7D');
        expect(document.cookie).to.contain('session-bar-expiration_time=');
        done();
      });
    });

    it('only rewrites the cookie once per run loop when multiple properties are changed', (done) => {
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
