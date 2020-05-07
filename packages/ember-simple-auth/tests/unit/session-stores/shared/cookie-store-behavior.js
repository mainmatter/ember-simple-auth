import { next, run } from '@ember/runloop';
import { registerWarnHandler } from '@ember/debug';
import {
  describe,
  beforeEach,
  afterEach,
  it
} from 'mocha';
import { expect } from 'chai';
import sinonjs from 'sinon';
import FakeCookieService from '../../../helpers/fake-cookie-service';

let warnings;
registerWarnHandler((message, options, next) => {
  // in case a deprecation is issued before a test is started
  if (!warnings) {
    warnings = [];
  }

  warnings.push(message);
  next(message, options);
});

export default function(options) {
  let sinon;
  let store;
  let createStore;
  let renew;
  let sync;
  let cookieService;
  let spyRewriteCookieMethod;

  // eslint-disable-next-line mocha/no-top-level-hooks
  beforeEach(function() {
    sinon = sinonjs.createSandbox();
    createStore = options.createStore;
    renew = options.renew;
    sync = options.sync;
    cookieService = FakeCookieService.create();
    sinon.spy(cookieService, 'read');
    sinon.spy(cookieService, 'write');
    store = createStore(cookieService);
    spyRewriteCookieMethod = options.spyRewriteCookieMethod;
  });

  // eslint-disable-next-line mocha/no-top-level-hooks
  afterEach(function() {
    sinon.restore();
    store.clear();
  });

  describe('#persist', function() {
    beforeEach(function() {
      warnings = [];
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
        { domain: null, expires: null, path: '/', sameSite: null, secure: false }
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
        { domain: 'example.com', expires: null, path: '/', sameSite: null, secure: false }
      );
    });

    it('respects the configured cookiePath', function() {
      let store;
      run(() => {
        store = createStore(cookieService, {
          cookieName: 'session-cookie-domain',
          cookieDomain: 'example.com',
          cookiePath: '/hello-world'
        });
        store.persist({ key: 'value' });
      });

      expect(cookieService.write).to.have.been.calledWith(
        'session-cookie-domain',
        JSON.stringify({ key: 'value' }),
        { domain: 'example.com', expires: null, path: '/hello-world', sameSite: null, secure: false }
      );
    });

    it('respects the configured sameSite', function() {
      let store;
      run(() => {
        store = createStore(cookieService, {
          cookieName: 'session-cookie-domain',
          cookieDomain: 'example.com',
          sameSite: 'Strict'
        });
        store.persist({ key: 'value' });
      });

      expect(cookieService.write).to.have.been.calledWith(
        'session-cookie-domain',
        JSON.stringify({ key: 'value' }),
        { domain: 'example.com', expires: null, path: '/', sameSite: 'Strict', secure: false }
      );
    });

    it('sends a warning when `cookieExpirationTime` is less than 90 seconds', function(done) {
      run(() => {
        createStore(cookieService, {
          cookieName: 'session-cookie-domain',
          cookieDomain: 'example.com',
          cookieExpirationTime: 60
        });

        expect(warnings).to.have.length(1);
        expect(warnings[0]).to.equal('The recommended minimum value for `cookieExpirationTime` is 90 seconds. If your value is less than that, the cookie may expire before its expiration time is extended (expiration time is extended every 60 seconds).');

        done();
      });
    });
  });

  describe('#renew', function() {
    let now = new Date();

    beforeEach(async function() {
      store = createStore(cookieService, {
        cookieName:           'test-session',
        cookieExpirationTime: 60
      });
      store.persist({ key: 'value' });
      await renew(store);
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

    it('deletes the old cookie and writes a new one when domain property changes', function() {
      let defaultName = 'ember_simple_auth-session';
      run(() => {
        store.persist({ key: 'value' });
        store.set('cookieDomain', 'example.com');
      });

      expect(cookieService.clear).to.have.been.calledWith(defaultName);

      expect(cookieService.clear).to.have.been.calledWith(`${defaultName}-expiration_time`);

      expect(cookieService.write).to.have.been.calledWith(
        'session-foo',
        JSON.stringify({ key: 'value' }),
        sinon.match(function({ domain, expires, path, secure }) {
          return domain === 'example.com' &&
            path === '/' &&
            secure === false &&
            expires >= new Date(now.getTime() + 1000 * 1000);
        })
      );
    });

    it('deletes the old cookie and writes a new one when expiration property changes', function() {
      let defaultName = 'ember_simple_auth-session';
      let expirationTime = 180;
      run(() => {
        store.persist({ key: 'value' });
        store.set('cookieExpirationTime', expirationTime);
      });

      expect(cookieService.clear).to.have.been.calledWith(defaultName);

      expect(cookieService.clear).to.have.been.calledWith(`${defaultName}-expiration_time`);

      expect(cookieService.write).to.have.been.calledWith(
        'session-foo',
        JSON.stringify({ key: 'value' }),
        sinon.match(function({ domain, expires, path, secure }) {
          return domain === null &&
            path === '/' &&
            secure === false &&
            expires >= new Date(now.getTime() + (expirationTime - 10) * 1000);
        })
      );
    });

    it('clears cached expiration times when setting expiration to null', function() {
      run(() => {
        store.set('cookieExpirationTime', null);
      });

      expect(cookieService.clear).to.have.been.calledWith(`session-foo-expiration_time`);
    });

    it('only rewrites the cookie once per run loop when multiple properties are changed', function(done) {
      run(() => {
        store.set('cookieName', 'session-bar');
        store.set('cookieExpirationTime', 10000);
      });

      next(() => {
        expect(cookieSpy).to.have.been.calledOnce;
        done();
      });
    });
  });

  describe('#init', function() {
    let cookieName = 'ember_simple_auth-session-expiration_time';
    let expirationTime = 60 * 60 * 24;
    beforeEach(function() {
      cookieService.write(cookieName, expirationTime);
      store = createStore(cookieService);
    });

    afterEach(function() {
      cookieService.clear(cookieName);
    });

    it('restores expiration time from cookie', function() {
      expect(store.get('cookieExpirationTime')).to.equal(expirationTime);
    });
  });
}
