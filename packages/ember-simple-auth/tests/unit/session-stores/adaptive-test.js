import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';
import sinonjs from 'sinon';
import itBehavesLikeAStore from './shared/store-behavior';
import itBehavesLikeACookieStore from './shared/cookie-store-behavior';
import FakeCookieService from '../../helpers/fake-cookie-service';
import createAdaptiveStore from '../../helpers/create-adaptive-store';
import assign from 'ember-simple-auth/utils/assign';

module('AdaptiveStore', function(hooks) {
  setupTest(hooks);

  module('when localStorage is available', function(hooks) {
    itBehavesLikeAStore({
      hooks,
      store(sinon, owner) {
        let store;
        let cookieService;
        owner.register('service:cookies', FakeCookieService);
        cookieService = owner.lookup('service:cookies');
        sinon.spy(cookieService, 'read');
        sinon.spy(cookieService, 'write');
        store = createAdaptiveStore(cookieService, {
          _isLocalStorageAvailable: true,
        }, owner);
        return store;
      }
    });
  });

  module('when localStorage is not available', function(hooks) {
    itBehavesLikeAStore({
      hooks,
      store(sinon, owner) {
        let store;
        let cookieService;
        owner.register('service:cookies', FakeCookieService);
        cookieService = owner.lookup('service:cookies');
        sinon.spy(cookieService, 'read');
        sinon.spy(cookieService, 'write');
        store = createAdaptiveStore(cookieService, {
          _isLocalStorageAvailable: false,
          _cookieName: 'test:session',
        }, owner);
        return store;
      }
    });
  });

  module('CookieStore', function() {
    module('Behaviour', function(hooks) {
      itBehavesLikeACookieStore({
        hooks,
        store(sinon, owner, storeOptions) {
          owner.register('service:cookies', FakeCookieService);
          let cookieService = owner.lookup('service:cookies');
          sinon.spy(cookieService, 'read');
          sinon.spy(cookieService, 'write');
          let store = createAdaptiveStore(cookieService, assign({
            _isLocalStorageAvailable: false,
            _cookieName: 'test:session',
          }, storeOptions), owner);
          return store;
        },
        renew(store, data) {
          return store.get('_store')._renew(data);
        },
        sync(store) {
          store.get('_store')._syncData();
        },
        spyRewriteCookieMethod(sinon, store) {
          sinon.spy(store.get('_store'), 'rewriteCookie');
          return store.get('_store').rewriteCookie;
        }
      });
    });

    test('persists to cookie when cookie attributes change', async function(assert) {
      let sinon = sinonjs.createSandbox();
      let store;
      let cookieService;
      let now;

      this.owner.register('service:cookies', FakeCookieService);
      cookieService = this.owner.lookup('service:cookies');
      sinon.spy(cookieService, 'read');
      sinon.spy(cookieService, 'write');
      run(() => {
        now = new Date();
        store = createAdaptiveStore(cookieService, {
          _isLocalStorageAvailable: false,
          _cookieName: 'test:session',
        }, this.owner);

        store.setProperties({
          cookieName:           'test:session',
          cookieExpirationTime: 60
        });
      });
      await store.persist({ key: 'value' });

      assert.ok(cookieService.write.calledWith(
        'test:session-expiration_time',
        60,
        sinon.match(function({ domain, expires, path, secure }) {
          return domain === null &&
            path === '/' &&
            secure === false && expires >= new Date(now.getTime() + 60 * 1000);
        })
      ));
    });
  });
});
