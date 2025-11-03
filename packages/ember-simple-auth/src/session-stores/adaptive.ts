import { computed } from '@ember/object';
import { service } from '@ember/service';
import { getOwner } from '@ember/application';
import Base from './base';
import type CookiesService from 'ember-cookies/services/cookies';
import type CookieStore from './cookie';
import type LocalStorageStore from './local-storage';
import { debug } from '@ember/debug';

const LOCAL_STORAGE_TEST_KEY = '_ember_simple_auth_test_key';

const proxyToInternalStore = function () {
  return computed({
    get(this: AdaptiveStore, key: string) {
      return this.get(`_${key}`);
    },
    set(this: AdaptiveStore, key: string, value: any) {
      this.set(`_${key}`, value);
      let _store = this.get('_store');
      if (_store) {
        _store.set(key, value);
      }
      return value;
    },
  });
};

/**
  Session store that persists data in the browser's `localStorage` (see
  {@linkplain LocalStorageStore}) if that is available or in
  a cookie (see {@linkplain CookieStore}) if it is not.

  __This is the default store that Ember Simple Auth will use when the
  application doesn't define a custom store.__

  __This session store does not work with FastBoot. In order to use Ember
  Simple Auth with FastBoot, configure the
  {@linkplain CookieStore} as the application's session
  store.__

  @class AdaptiveStore
  @extends BaseStore
  @public
*/
export default class AdaptiveStore extends Base {
  /**
    The `localStorage` key the store persists data in if `localStorage` is
    available.

    @memberof AdaptiveStore
    @property localStorageKey
    @type String
    @default 'ember_simple_auth-session'
    @public
  */
  localStorageKey = 'ember_simple_auth-session';

  /**
    The domain to use for the cookie if `localStorage` is not available, e.g.,
    "example.com", ".example.com" (which includes all subdomains) or
    "subdomain.example.com". If not explicitly set, the cookie domain defaults
    to the domain the session was authenticated on.

    @memberof AdaptiveStore
    @property cookieDomain
    @type String
    @default null
    @public
  */
  _cookieDomain = null;
  @proxyToInternalStore()
  cookieDomain!: null | string;

  /**
    Allows servers to assert that a cookie ought not to be sent along with
    cross-site requests, which provides some protection against cross-site
    request forgery attacks (CSRF).

    Available options:
    - "Strict"
    - "Lax"

    @memberof AdaptiveStore
    @property sameSite
    @type String
    @default null
    @public
  */
  _sameSite = null;
  @proxyToInternalStore()
  sameSite!: null | 'Strict' | 'Lax' | 'None';

  /**
    Allows servers to assert that a cookie should opt in to partitioned storage,
    i.e. use a separate cookie per top level site if the cookie is used in a
    third party context

    Available options:
    - null
    - true

    @memberof AdaptiveStore
    @property partitioned
    @type Boolean
    @default null
    @public
  */
  _partitioned = null;
  @proxyToInternalStore()
  partitioned!: null | boolean;

  /**
    The name of the cookie to use if `localStorage` is not available.

    @memberof AdaptiveStore
    @property cookieName
    @type String
    @default ember_simple_auth-session
    @public
  */
  _cookieName = 'ember_simple_auth-session';
  @proxyToInternalStore()
  cookieName!: string;

  /**
    The path to use for the cookie, e.g., "/", "/something".

    @memberof AdaptiveStore
    @property cookiePath
    @type String
    @default '/'
    @public
  */
  _cookiePath = '/';
  @proxyToInternalStore()
  cookiePath!: string;

  /**
    The expiration time for the cookie in seconds if `localStorage` is not
    available. A value of `null` will make the cookie a session cookie that
    expires and gets deleted when the browser is closed.

    @memberof AdaptiveStore
    @property cookieExpirationTime
    @default null
    @type Integer
    @public
  */
  _cookieExpirationTime = null;
  @proxyToInternalStore()
  cookieExpirationTime!: number | null;

  @service('cookies') declare _cookies: CookiesService;
  declare _fastboot: any;

  declare _store: CookieStore | LocalStorageStore;

  __isLocalStorageAvailable: boolean | null = null;
  get _isLocalStorageAvailable() {
    if (this.__isLocalStorageAvailable !== null) {
      return this.__isLocalStorageAvailable;
    } else {
      return testLocalStorageAvailable();
    }
  }

  init(emberOwner: any, __isLocalStorageAvailable?: boolean | null) {
    super.init(emberOwner);

    if (typeof __isLocalStorageAvailable == 'boolean') {
      this.__isLocalStorageAvailable = __isLocalStorageAvailable;
      debug(
        `ember-simple-auth: session-store received __isLocalStorageAvailable: ${__isLocalStorageAvailable}`
      );
    }

    let owner = getOwner(this) as any;
    if (owner && !this.hasOwnProperty('_fastboot')) {
      this._fastboot = owner.lookup('service:fastboot');
    }

    let store;
    if (this.get('_isLocalStorageAvailable')) {
      const localStorage = owner.lookup('session-store:local-storage');
      const options = { key: this.get('localStorageKey'), _isFastBoot: false };

      localStorage.setProperties(options);

      store = localStorage;
    } else {
      const cookieStorage = owner.lookup('session-store:cookie');
      const options = this.getProperties(
        'cookieDomain',
        'cookieName',
        'cookieExpirationTime',
        'cookiePath',
        'sameSite',
        'partitioned'
      );

      cookieStorage.setProperties(options);
      this.set('cookieExpirationTime', cookieStorage.get('cookieExpirationTime'));

      store = cookieStorage;
    }

    this.set('_store', store);
    this._setupStoreEvents(store);
  }

  _setupStoreEvents(store: CookieStore | LocalStorageStore) {
    store.on('sessionDataUpdated', ({ detail: data }) => {
      this.trigger('sessionDataUpdated', data);
    });
    return store;
  }

  /**
    Persists the `data` in the `localStorage` if it is available or in a cookie
    if it is not.

    @memberof AdaptiveStore
    @method persist
    @param {Object} data The data to persist
    @return {Promise} A promise that resolves when the data has successfully been persisted and rejects otherwise.
    @public
  */
  persist(data: Record<string, string>) {
    return this.get('_store').persist(data);
  }

  /**
    Returns all data currently stored in the `localStorage` if that is
    available - or if it is not, in the cookie - as a plain object.

    @memberof AdaptiveStore
    @method restore
    @return {Promise} A promise that resolves with the data currently persisted in the store when the data has been restored successfully and rejects otherwise.
    @public
  */
  restore() {
    return this.get('_store').restore();
  }

  /**
    Clears the store by deleting the
    {@linkplain LocalStorageStore.key} from
    `localStorage` if that is available or by deleting the cookie if it is not.

    @memberof AdaptiveStore
    @method clear
    @return {Promise} A promise that resolves when the store has been cleared successfully and rejects otherwise.
    @public
  */
  clear() {
    return this.get('_store').clear();
  }
}

function testLocalStorageAvailable() {
  try {
    localStorage.setItem(LOCAL_STORAGE_TEST_KEY, 'true');
    localStorage.removeItem(LOCAL_STORAGE_TEST_KEY);
    return true;
  } catch (e) {
    return false;
  }
}
