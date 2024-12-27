import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { later, cancel, scheduleOnce, next, type Timer } from '@ember/runloop';
import { typeOf, isEmpty, isNone } from '@ember/utils';
import { A } from '@ember/array';
import { warn } from '@ember/debug';
import BaseStore from './base';
import objectsAreEqual from '../utils/objects-are-equal';
import { isTesting } from '@embroider/macros';
import type CookiesService from 'ember-cookies/services/cookies';
import type { WriteOptions } from 'ember-cookies/services/cookies';
import { getOwner } from '@ember/application';

const persistingProperty = function (beforeSet = function (_key: string, _value: any) {}) {
  return computed({
    get(key) {
      return this.get(`_${key}`);
    },
    set(key, value) {
      beforeSet.apply(this, [key, value]);
      this.set(`_${key}`, value);
      scheduleOnce('actions', this, this.rewriteCookie);
      return value;
    },
  });
};

/**
  Session store that persists data in a cookie.

  By default the cookie session store uses a session cookie that expires and is
  deleted when the browser is closed. The cookie expiration period can be
  configured by setting the
  {@linkplain CookieStore.cookieExpirationTime}
  property. This can be used to implement "remember me" functionality that will
  either store the session persistently or in a session cookie depending on
  whether the user opted in or not:

  ```js
  // app/controllers/login.js
  import Controller from '@ember/controller';
  import { inject as service } from '@ember/service';

  export default class LoginController extends Controller {
    &#64;service session;
    _rememberMe = false;

    get rememberMe() {
      return this._rememberMe;
    }

    set rememberMe(value) {
      let expirationTime = value ? (14 * 24 * 60 * 60) : null;
      this.set('session.store.cookieExpirationTime', expirationTime);
      this._rememberMe = value;
    }
  }
  ```

  __Applications that use FastBoot must use this session store by defining the
  application session store like this:__

  ```js
  // app/session-stores/application.js
  import CookieStore from 'ember-simple-auth/session-stores/cookie';

  export default class ApplicationSessionStore extends CookieStore {}
  ```

  @class CookieStore
  @extends BaseStore
  @public
*/
export default class CookieStore extends BaseStore {
  _syncDataTimeout: Timer | null = null;
  _renewExpirationTimeout: Timer | null = null;
  /**
    The domain to use for the cookie, e.g., "example.com", ".example.com"
    (which includes all subdomains) or "subdomain.example.com". If not
    explicitly set, the cookie domain defaults to the domain the session was
    authenticated on.

    @memberof CookieStore
    @property cookieDomain
    @type String
    @default null
    @public
  */
  _cookieDomain = null;
  @persistingProperty()
  cookieDomain!: null | string;

  /**
    Allows servers to assert that a cookie ought not to be sent along with cross-site requests,
    which provides some protection against cross-site request forgery attacks (CSRF).
    Available options:
    - "Strict"
    - "Lax"
    @memberof CookieStore
    @property sameSite
    @type String
    @default null
    @public
  */
  _sameSite = null;
  @persistingProperty()
  sameSite!: null | 'Strict' | 'Lax' | 'None';

  /**
    The name of the cookie.

    @memberof CookieStore
    @property cookieName
    @type String
    @default ember_simple_auth-session
    @public
  */
  _cookieName = 'ember_simple_auth-session';

  _oldCookieName: string | null = null;
  @persistingProperty(function (this: CookieStore) {
    this._oldCookieName = this._cookieName;
  })
  cookieName!: string;

  /**
    The path to use for the cookie, e.g., "/", "/something".

    @memberof CookieStore
    @property cookiePath
    @type String
    @default '/'
    @public
  */
  _cookiePath = '/';
  @persistingProperty()
  cookiePath!: string;

  /**
    The expiration time for the cookie in seconds. A value of `null` will make
    the cookie a session cookie that expires and gets deleted when the browser
    is closed.

    The recommended minimum value is 90 seconds. If your value is less than
    that, the cookie may expire before its expiration time is extended
    (expiration time is extended every 60 seconds).

    @memberof CookieStore
    @property cookieExpirationTime
    @default null
    @type Integer
    @public
  */
  _cookieExpirationTime = null;
  @persistingProperty(function (this: CookieStore, key, value) {
    // When nulling expiry time on purpose, we need to clear the cached value.
    // Otherwise, `_calculateExpirationTime` will reuse it.
    if (isNone(value)) {
      this.get('_cookies').clear(`${this.get('cookieName')}-expiration_time`);
    } else if (value < 90) {
      warn(
        'The recommended minimum value for `cookieExpirationTime` is 90 seconds. If your value is less than that, the cookie may expire before its expiration time is extended (expiration time is extended every 60 seconds).',
        false,
        { id: 'ember-simple-auth.cookieExpirationTime' }
      );
    }
  })
  cookieExpirationTime!: number | null;

  /**
    Allows servers to assert that a cookie should opt in to partitioned storage,
    i.e. use a separate cookie per top level site if the cookie is used in a
    third party context

    Available options:
    - null
    - true

    @memberof CookieStore
    @property partitioned
    @type Boolean
    @default null
    @public
  */
  _partitioned = null;
  @persistingProperty()
  partitioned!: null | boolean;

  @service('cookies') declare _cookies: CookiesService;

  _fastboot: any;

  _secureCookies(): boolean {
    if (this.get('_fastboot.isFastBoot')) {
      return this.get('_fastboot.request.protocol') === 'https:';
    }

    return window.location.protocol === 'https:';
  }

  _isPageVisible() {
    if (this.get('_fastboot.isFastBoot')) {
      return false;
    } else {
      const visibilityState =
        typeof document !== 'undefined' ? document.visibilityState || 'visible' : false;
      return visibilityState === 'visible';
    }
  }

  _isFastBoot: boolean = false;
  _lastData: Record<string, string> | null = null;

  init(properties: any) {
    super.init(properties);

    this._fastboot = (getOwner(this) as any).lookup('service:fastboot');

    let cachedExpirationTime = this._read(`${this.get('cookieName')}-expiration_time`);
    if (cachedExpirationTime) {
      this.set('cookieExpirationTime', parseInt(cachedExpirationTime as any, 10));
    }

    if (!this.get('_fastboot.isFastBoot')) {
      next(() => {
        this._syncData().then(() => {
          this._renewExpiration();
        });
      });
    } else {
      this._renew();
    }
  }

  /**
    Persists the `data` in the cookie.

    @memberof CookieStore
    @method persist
    @param {Object} data The data to persist
    @return {Promise} A promise that resolves when the data has successfully been persisted and rejects otherwise.
    @public
  */
  persist(data: Record<string, string>) {
    this._lastData = data;
    const stringifiedData = JSON.stringify(data || {});
    let expiration = this._calculateExpirationTime();
    this._write(stringifiedData, expiration);
    return Promise.resolve();
  }

  /**
    Returns all data currently stored in the cookie as a plain object.

    @memberof CookieStore
    @method restore
    @return {Promise} A promise that resolves with the data currently persisted in the store when the data has been restored successfully and rejects otherwise.
    @public
  */
  restore() {
    let data = this._read(this.get('cookieName'));
    return Promise.resolve(JSON.parse(data && typeof data === 'string' ? data : '{}'));
  }

  /**
    Clears the store by deleting the cookie.

    @memberof CookieStore
    @method clear
    @return {Promise} A promise that resolves when the store has been cleared successfully and rejects otherwise.
    @public
  */
  clear() {
    this._write('', 0);
    this._lastData = {};
    return Promise.resolve();
  }

  _read(name: string) {
    return this.get('_cookies').read(name) || '';
  }

  _calculateExpirationTime(): number | undefined {
    const cachedExpirationTimeCookie = this._read(`${this.get('cookieName')}-expiration_time`);

    const cachedExpirationTime =
      cachedExpirationTimeCookie && typeof cachedExpirationTimeCookie === 'number'
        ? new Date().getTime() + cachedExpirationTimeCookie * 1000
        : null;

    const thisCookieExpirationTime = this.get('cookieExpirationTime');

    return thisCookieExpirationTime
      ? new Date().getTime() + thisCookieExpirationTime * 1000
      : cachedExpirationTime || undefined;
  }

  _write(value: string, expiration: number | undefined) {
    let cookieOptions = {
      domain: this.get('cookieDomain'),
      expires: !expiration ? null : new Date(expiration as number),
      path: this.get('cookiePath'),
      secure: this._secureCookies(),
      sameSite: this.get('sameSite'),
      partitioned: this.get('partitioned'),
    } as WriteOptions;

    if (this._oldCookieName) {
      A([this._oldCookieName, `${this._oldCookieName}-expiration_time`]).forEach(oldCookie => {
        this.get('_cookies').clear(oldCookie);
      });
      this._oldCookieName = null;
    }
    this.get('_cookies').write(this.get('cookieName'), value, cookieOptions);
    if (!isEmpty(expiration)) {
      let expirationCookieName = `${this.get('cookieName')}-expiration_time`;
      let cachedExpirationTime = this.get('_cookies').read(expirationCookieName);
      this.get('_cookies').write(
        expirationCookieName,
        this.get('cookieExpirationTime') || cachedExpirationTime,
        cookieOptions
      );
    }
  }

  _syncData() {
    return this.restore().then(data => {
      if (!objectsAreEqual(data, this._lastData)) {
        this._lastData = data;
        this.trigger('sessionDataUpdated', data);
      }
      if (!isTesting()) {
        this._syncDataTimeout && cancel(this._syncDataTimeout);
        this._syncDataTimeout = later(this, this._syncData, 500);
      }
    });
  }

  _renew() {
    return this.restore().then(data => {
      if (!isEmpty(data) && !(data.constructor === Object && Object.keys(data).length === 0)) {
        data = typeOf(data) === 'string' ? data : JSON.stringify(data || {});
        let expiration = this._calculateExpirationTime();
        this._write(data, expiration);
      }
    });
  }

  _renewExpiration() {
    if (!isTesting()) {
      this._renewExpirationTimeout && cancel(this._renewExpirationTimeout);
      this._renewExpirationTimeout = later(this, this._renewExpiration, 60000);
    }
    if (this._isPageVisible()) {
      return this._renew();
    } else {
      return Promise.resolve();
    }
  }

  rewriteCookie() {
    // if `cookieName` has not been renamed, `oldCookieName` will be nil
    const cookieName = this._oldCookieName || this._cookieName;
    const data = this._read(cookieName);
    if (data && typeof data === 'string') {
      const expiration = this._calculateExpirationTime();
      this._write(data, expiration);
    }
  }
}
