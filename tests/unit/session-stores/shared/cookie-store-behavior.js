/* jshint expr:true */
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
  let unspyRewriteCookieMethod;

  beforeEach(() => {
    createStore = options.createStore;
    renew = options.renew;
    sync = options.sync;
    cookieService = FakeCookieService.create();
    sinon.spy(cookieService, 'read');
    sinon.spy(cookieService, 'write');
    store = createStore(cookieService);
    spyRewriteCookieMethod = options.spyRewriteCookieMethod;
    unspyRewriteCookieMethod = options.unspyRewriteCookieMethod;
  });

  afterEach(() => {
    cookieService.read.restore();
    cookieService.write.restore();
    store.clear();
  });

  describe('#persist', function() {
    it('respects the configured cookieName', () => {
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

    it('respects the configured cookieDomain', () => {
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
  });

  describe('#renew', () => {
    let now = new Date();

    beforeEach((done) => {
      store = createStore(cookieService, {
        cookieName:           'test-session',
        cookieExpirationTime: 60
      });
      store.persist({ key: 'value' });
      renew(store).then(done);
    });

    it('stores the expiration time in a cookie named "test-session-expiration_time"', () => {
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

  describe('rewrite behavior', () => {
    let store;
    let cookieSpy;
    let cookieService;
    let now = new Date();

    beforeEach(() => {
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

    afterEach(() => {
      cookieService.write.restore();
      cookieService.clear.restore();
      cookieSpy.restore();
    });

    it('deletes the old cookie and writes a new one when name property changes', () => {
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
