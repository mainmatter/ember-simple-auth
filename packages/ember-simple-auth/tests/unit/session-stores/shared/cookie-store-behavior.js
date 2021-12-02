import { module, test } from 'qunit';
import { next, run } from '@ember/runloop';
import { registerWarnHandler } from '@ember/debug';
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
  let renew;
  let sync;
  let spyRewriteCookieMethod;
  let hooks = options.hooks;

  hooks.beforeEach(function() {
    sinon = sinonjs.createSandbox();
    renew = options.renew;
    sync = options.sync;
    spyRewriteCookieMethod = options.spyRewriteCookieMethod;
  });

  hooks.afterEach(function() {
    sinon.restore();
  });

  module('#persist', function(hooks) {
    let store;
    hooks.beforeEach(function() {
      run(() => {
        warnings = [];
        store = options.store(sinon, this.owner);
      });
    });

    test('respects the configured cookieName', async function(assert) {
      let cookieService = store.get('_cookies');
      await store.persist({ key: 'value' });

      assert.ok(cookieService.write.calledWith(
        'test:session',
        JSON.stringify({ key: 'value' }),
        { domain: null, expires: null, path: '/', sameSite: null, secure: false }
      ));
    });

    test('respects the configured cookieDomain', async function(assert) {
      let cookieService = store.get('_cookies');
      run(() => {
        store.set('cookieName', 'session-cookie-domain');
        store.set('cookieDomain', 'example.com');
      });
      await store.persist({ key: 'value' });

      assert.ok(cookieService.write.calledWith(
        'session-cookie-domain',
        JSON.stringify({ key: 'value' }),
        { domain: 'example.com', expires: null, path: '/', sameSite: null, secure: false }
      ));
    });

    test('respects the configured cookiePath', async function(assert) {
      run(() => {
        store.set('cookieName', 'session-cookie-domain');
        store.set('cookieDomain', 'example.com');
        store.set('cookiePath', '/hello-world');
      });
      let cookieService = store.get('_cookies');
      await store.persist({ key: 'value' });

      assert.ok(cookieService.write.calledWith(
        'session-cookie-domain',
        JSON.stringify({ key: 'value' }),
        { domain: 'example.com', expires: null, path: '/hello-world', sameSite: null, secure: false }
      ));
    });

    test('respects the configured sameSite', async function(assert) {
      run(() => {
        store.set('cookieName', 'session-cookie-domain');
        store.set('cookieDomain', 'example.com');
        store.set('sameSite', 'Strict');
      });
      let cookieService = store.get('_cookies');
      await store.persist({ key: 'value' });
      assert.ok(cookieService.write.calledWith(
        'session-cookie-domain',
        JSON.stringify({ key: 'value' }),
        { domain: 'example.com', expires: null, path: '/', sameSite: 'Strict', secure: false }
      ));
    });

    test('sends a warning when `cookieExpirationTime` is less than 90 seconds', async function(assert) {
      assert.expect(2);
      run(() => {
        store.set('cookieName', 'session-cookie-domain');
        store.set('cookieDomain', 'example.com');
        store.set('cookieExpirationTime', 60);
      });
      await store.persist({ key: 'value' });
      await new Promise(resolve => {
        run(() => {
          assert.equal(warnings.length, 1);
          assert.equal(warnings[0], 'The recommended minimum value for `cookieExpirationTime` is 90 seconds. If your value is less than that, the cookie may expire before its expiration time is extended (expiration time is extended every 60 seconds).');

          resolve();
        });
      });
    });
  });

  module('#renew', function(hooks) {
    let now = new Date();
    let cookieService;
    let store;

    hooks.beforeEach(async function() {
      run(() => {
        store = options.store(sinon, this.owner, {
          cookieName: 'test-session',
          cookieExpirationTime: 60,
        });
        cookieService = store.get('_cookies');
      });
      await store.persist({ key: 'value' });
      await renew(store);
    });

    test('stores the expiration time in a cookie named "test-session-expiration_time"', function(assert) {
      assert.ok(cookieService.write.calledWith(
        'test-session-expiration_time',
        60,
        sinon.match(function({ domain, expires, path, secure }) {
          return domain === null &&
            path === '/' &&
            secure === false && expires >= new Date(now.getTime() + 60 * 1000);
        })
      ));
    });
  });

  module('the "sessionDataUpdated" event', function(hooks) {
    let triggered;
    let store;

    hooks.beforeEach(async function() {
      run(() => {
        store = options.store(sinon, this.owner, {
          cookieName: 'ember_simple_auth-session',
        });
        triggered = false;
        store.one('sessionDataUpdated', () => {
          triggered = true;
        });
      });
      await store.persist({ key: 'value' });
    });

    test('is not triggered when the cookie has not actually changed', async function(assert) {
      assert.expect(1);
      document.cookie = 'ember_simple_auth-session=%7B%22key%22%3A%22value%22%7D;path=/;';
      sync(store);

      await new Promise(resolve => {
        next(() => {
          assert.notOk(triggered);
          resolve();
        });
      });
    });

    test('is triggered when the cookie changed', async function(assert) {
      assert.expect(1);
      const cookiesService = store.get('_cookies') || store.get('_store._cookies');
      cookiesService._content['ember_simple_auth-session'] = '%7B%22key%22%3A%22other%20value%22%7D';
      sync(store);

      await new Promise(resolve => {
        next(() => {
          next(() => {
            assert.ok(triggered);
            resolve();
          });
        });
      });
    });

    test('is not triggered when the cookie expiration was renewed', async function(assert) {
      assert.expect(1);
      renew(store, { key: 'value' });
      sync(store);

      await new Promise(resolve => {
        next(() => {
          assert.notOk(triggered);
          resolve();
        });
      });
    });
  });

  module('rewrite behavior', function(hooks) {
    let store;
    let cookieSpy;
    let cookieService;
    let now = new Date();

    hooks.beforeEach(function() {
      run(() => {
        cookieService = FakeCookieService.create();
        store = options.store(sinon, this.owner, {
          _cookieName: 'session-foo',
          _cookieExpirationTime: 1000
        });
        cookieService = store.get('_cookies') || store.get('_store._cookies');
        cookieSpy = spyRewriteCookieMethod(sinon, store);
        sinon.spy(cookieService, 'clear');
      });
    });

    hooks.afterEach(function() {
      cookieService.write.restore();
      cookieService.clear.restore();
      cookieSpy.restore();
    });

    test('deletes the old cookie and writes a new one when name property changes', async function(assert) {
      run(() => {
        store.set('cookieName', 'session-bar');
      });
      await store.persist({ key: 'value' });

      assert.ok(cookieService.clear.calledWith('session-foo'));

      assert.ok(cookieService.clear.calledWith('session-foo-expiration_time'));

      assert.ok(cookieService.write.calledWith(
        'session-bar',
        JSON.stringify({ key: 'value' }),
        sinon.match(function({ domain, expires, path, secure }) {
          return domain === null &&
            path === '/' &&
            secure === false &&
            expires >= new Date(now.getTime() + 1000 * 1000);
        })
      ));

      assert.ok(cookieService.write.calledWith(
        'session-bar-expiration_time',
        1000,
        sinon.match(function({ domain, expires, path, secure }) {
          return domain === null &&
            path === '/' &&
            secure === false &&
            expires >= new Date(now.getTime() + 1000 * 1000);
        })
      ));
    });

    test('deletes the old cookie and writes a new one when domain property changes', async function(assert) {
      let defaultName = 'session-foo';
      run(() => {
        store.set('cookieDomain', 'example.com');
        store.set('cookieName', 'session-bar');
      });
      await store.persist({ key: 'value' });

      assert.ok(cookieService.clear.calledWith(defaultName));

      assert.ok(cookieService.clear.calledWith(`${defaultName}-expiration_time`));

      assert.ok(cookieService.write.calledWith(
        'session-bar',
        JSON.stringify({ key: 'value' }),
        sinon.match(function({ domain, expires, path, secure }) {
          return domain === 'example.com' &&
            path === '/' &&
            secure === false &&
            expires >= new Date(now.getTime() + 1000 * 1000);
        })
      ));
    });

    test('deletes the old cookie and writes a new one when expiration property changes', async function(assert) {
      let defaultName = 'session-foo';
      let expirationTime = 180;
      run(() => {
        store.set('cookieExpirationTime', expirationTime);
        store.set('cookieName', 'session-bar');
      });
      await store.persist({ key: 'value' });

      assert.ok(cookieService.clear.calledWith(defaultName));

      assert.ok(cookieService.clear.calledWith(`${defaultName}-expiration_time`));

      assert.ok(cookieService.write.calledWith(
        'session-bar',
        JSON.stringify({ key: 'value' }),
        sinon.match(function({ domain, expires, path, secure }) {
          return domain === null &&
            path === '/' &&
            secure === false &&
            expires >= new Date(now.getTime() + (expirationTime - 10) * 1000);
        })
      ));
    });

    test('clears cached expiration times when setting expiration to null', async function(assert) {
      assert.expect(1);
      run(() => {
        store.set('cookieExpirationTime', null);
      });

      await new Promise(resolve => {
        next(() => {
          assert.ok(cookieService.clear.calledWith(`session-foo-expiration_time`));
          resolve();
        });
      });
    });

    test('only rewrites the cookie once per run loop when multiple properties are changed', async function(assert) {
      assert.expect(1);
      run(() => {
        store.set('cookieName', 'session-bar');
        store.set('cookieExpirationTime', 10000);
      });

      await new Promise(resolve => {
        next(() => {
          assert.ok(cookieSpy.calledOnce);
          resolve();
        });
      });
    });
  });

  module('#init', function(hooks) {
    let store;
    let cookieService;
    let cookieName = 'ember_simple_auth-session-expiration_time';
    let expirationTime = 60 * 60 * 24;

    hooks.beforeEach(async function() {
      run(() => {
        store = options.store(sinon, this.owner, {
          cookieExpirationTime: expirationTime,
        });
        cookieService = store.get('_cookies');
      });
      await cookieService.write(cookieName, expirationTime);
    });

    test('restores expiration time from cookie', function(assert) {
      assert.equal(store.get('cookieExpirationTime'), expirationTime);
    });
  });
}
