import Ember from 'ember';
import BaseStore from './base';
import objectsAreEqual from '../utils/objects-are-equal';

const { RSVP, computed, run, run: { next, cancel, later }, isEmpty, typeOf, testing, isBlank, isPresent } = Ember;

/**
  Session store that persists data in a cookie.

  By default the cookie session store uses a session cookie that expires and is
  deleted when the browser is closed. The cookie expiration period can be
  configured by setting the
  {{#crossLink "CookieStore/cookieExpirationTime:property"}}{{/crossLink}}
  property. This can be used to implement "remember me" functionality that will
  either store the session persistently or in a session cookie depending on
  whether the user opted in or not:

  ```js
  // app/controllers/login.js
  export default Ember.Controller.extend({
    rememberMe: false,

    _rememberMeChanged: Ember.observer('rememberMe', function() {
      const expirationTime = this.get('rememberMe') ? (14 * 24 * 60 * 60) : null;
      this.set('session.store.cookieExpirationTime', expirationTime);
    }
  });
  ```

  __In order to keep multiple tabs/windows of an application in sync, this
  store has to periodically (every 500ms) check the cookie for changes__ as
  there are no events for cookie changes that the store could subscribe to. If
  the application does not need to make sure all session data is deleted when
  the browser is closed, the
  {{#crossLink "LocalStorageStore"}}`localStorage` session store{{/crossLink}}
  should be used.

  @class CookieStore
  @module ember-simple-auth/session-stores/cookie
  @extends BaseStore
  @public
*/
export default BaseStore.extend({
  /**
    The domain to use for the cookie, e.g., "example.com", ".example.com"
    (which includes all subdomains) or "subdomain.example.com". If not
    explicitly set, the cookie domain defaults to the domain the session was
    authneticated on.

    @property cookieDomain
    @type String
    @default null
    @public
  */
  _cookieDomain: null,
  cookieDomain: computed('_cookieDomain', {
    get() {
      return this.get('_cookieDomain');
    },
    set(key, value) {
      this.set('_cookieDomain', value);
      run.scheduleOnce('actions', this, this.rewriteCookie);
      return value;
    }
  }),

  /**
    The name of the cookie.

    @property cookieName
    @type String
    @default ember_simple_auth-session
    @public
  */
  _cookieName: 'ember_simple_auth-session',
  cookieName: computed('_cookieName', {
    get() {
      return this.get('_cookieName');
    },
    set(key, value) {
      this._oldCookieName = this._cookieName;
      this.set('_cookieName', value);
      run.scheduleOnce('actions', this, this.rewriteCookie);
      return value;
    }
  }),

  /**
    The expiration time for the cookie in seconds. A value of `null` will make
    the cookie a session cookie that expires and gets deleted when the browser
    is closed.

    @property cookieExpirationTime
    @default null
    @type Integer
    @public
  */
  _cookieExpirationTime: null,
  cookieExpirationTime: computed('_cookieExpirationTime', {
    get() {
      return this.get('_cookieExpirationTime');
    },
    set(key, value) {
      this.set('_cookieExpirationTime', value);
      run.scheduleOnce('actions', this, this.rewriteCookie);
      return value;
    }
  }),

  _secureCookies: window.location.protocol === 'https:',

  _syncDataTimeout: null,

  _renewExpirationTimeout: null,

  _isPageVisible: computed(function() {
    const visibilityState = document.visibilityState || 'visible';
    return visibilityState === 'visible';
  }).volatile(),

  init() {
    this._super(...arguments);

    next(() => {
      this._syncData().then(() => {
        this._renewExpiration();
      });
    });
  },

  /**
    Persists the `data` in the cookie.

    @method persist
    @param {Object} data The data to persist
    @return {Ember.RSVP.Promise} A promise that resolves when the data has successfully been persisted and rejects otherwise.
    @public
  */
  persist(data) {
    this._lastData = data;
    data           = JSON.stringify(data || {});
    let expiration = this._calculateExpirationTime();
    this._write(data, expiration);
    return RSVP.resolve();
  },

  /**
    Returns all data currently stored in the cookie as a plain object.

    @method restore
    @return {Ember.RSVP.Promise} A promise that resolves with the data currently persisted in the store when the data has been restored successfully and rejects otherwise.
    @public
  */
  restore() {
    let data = this._read(this.get('cookieName'));
    if (isEmpty(data)) {
      return RSVP.resolve({});
    } else {
      return RSVP.resolve(JSON.parse(data));
    }
  },

  /**
    Clears the store by deleting the cookie.

    @method clear
    @return {Ember.RSVP.Promise} A promise that resolves when the store has been cleared successfully and rejects otherwise.
    @public
  */
  clear() {
    this._write(null, 0);
    this._lastData = {};
    return RSVP.resolve();
  },

  _read(name) {
    let value = document.cookie.match(new RegExp(`${name}=([^;]+)`)) || [];
    return decodeURIComponent(value[1] || '');
  },

  _calculateExpirationTime() {
    let cachedExpirationTime = this._read(`${this._cookieName}-expiration_time`);
    cachedExpirationTime     = !!cachedExpirationTime ? new Date().getTime() + cachedExpirationTime * 1000 : null;
    return this._cookieExpirationTime ? new Date().getTime() + this._cookieExpirationTime * 1000 : cachedExpirationTime;
  },

  _write(value, expiration) {
    if (!!this._oldCookieName) {
      document.cookie = `${this._oldCookieName}=`;
    }

    if (isBlank(value) && expiration !== 0) {
      return;
    }

    let path        = '; path=/';
    let expires     = isEmpty(expiration) ? '' : `; expires=${new Date(expiration).toUTCString()}`;
    let secure      = !!this._secureCookies ? ';secure' : '';
    let cookieName = this._cookieName;
    let cookieDomain = this._cookieDomain;
    let domain      = isEmpty(cookieDomain) ? '' : `;domain=${cookieDomain}`;
    let cookieExpirationTime = this.get('_cookieExpirationTime');
    document.cookie = `${cookieName}=${encodeURIComponent(value)}${domain}${path}${expires}${secure}`;
    if (expiration !== null && cookieExpirationTime !== null) {
      let cachedExpirationTime = this._read(`${cookieName}-expiration_time`);
      let expiry = encodeURIComponent(cookieExpirationTime) || cachedExpirationTime;
      document.cookie = `${cookieName}-expiration_time=${expiry}${domain}${path}${expires}${secure}`;
    }
  },

  _syncData() {
    return this.restore().then((data) => {
      if (!objectsAreEqual(data, this._lastData)) {
        this._lastData = data;
        this.trigger('sessionDataUpdated', data);
      }
      if (!testing) {
        cancel(this._syncDataTimeout);
        this._syncDataTimeout = later(this, this._syncData, 500);
      }
    });
  },

  _renew() {
    return this.restore().then((data) => {
      if (!isEmpty(data) && data !== {}) {
        data           = typeOf(data) === 'string' ? data : JSON.stringify(data || {});
        let expiration = this._calculateExpirationTime();
        this._write(data, expiration);
      }
    });
  },

  _renewExpiration() {
    if (!testing) {
      cancel(this._renewExpirationTimeout);
      this._renewExpirationTimeout = later(this, this._renewExpiration, 60000);
    }
    if (this.get('_isPageVisible')) {
      return this._renew();
    } else {
      return RSVP.resolve();
    }
  },

  rewriteCookie() {
    const data = this._read(this._oldCookieName);
    if (isPresent(data)) {
      const expiration = this._calculateExpirationTime();
      this.clear();
      this._write(data, expiration);
    }
  }
});
