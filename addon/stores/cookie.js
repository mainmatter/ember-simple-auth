import Ember from 'ember';
import Base from './base';
import objectsAreEqual from '../utils/objects-are-equal';

const { computed } = Ember;

const { on } = Ember;

/**
  Store that saves its data in a cookie.

  __In order to keep multiple tabs/windows of an application in sync, this
  store has to periodically (every 500ms) check the cookie__ for changes as
  there are no events that notify of changes in cookies. The recommended
  alternative is `Stores.LocalStorage` that also persistently stores data but
  instead of cookies relies on the `localStorage` API and does not need to poll
  for external changes.

  By default the cookie store will use a session cookie that expires and is
  deleted when the browser is closed. The cookie expiration period can be
  configured via setting
  [`Stores.Cooke#cookieExpirationTime`](#SimpleAuth-Stores-Cookie-cookieExpirationTime)
  though. This can also be used to implement "remember me" functionality that
  will either store the session persistently or in a session cookie depending
  whether the user opted in or not:

  ```js
  // app/controllers/login.js
  export default Ember.Controller.extend({
    rememberMe: false,

    rememberMeChanged: function() {
      this.get('session.store').cookieExpirationTime = this.get('rememberMe') ? (14 * 24 * 60 * 60) : null;
    }.observes('rememberMe')
  });
  ```

  _The factory for this store is registered as
  `'session-store:cookie'` in Ember's container._

  @class Cookie
  @namespace Stores
  @module stores/cookie
  @extends Stores.Base
  @public
*/
export default Base.extend({
  /**
    The domain to use for the cookie, e.g., "example.com", ".example.com"
    (includes all subdomains) or "subdomain.example.com". If not configured the
    cookie domain defaults to the domain the session was authneticated on.

    This value can be configured via
    [`SimpleAuth.Configuration.CookieStore#cookieDomain`](#SimpleAuth-Configuration-CookieStore-cookieDomain).

    @property cookieDomain
    @type String
    @default null
    @public
  */
  cookieDomain: null,

  /**
    The name of the cookie the store stores its data in.

    This value can be configured via
    [`SimpleAuth.Configuration.CookieStore#cookieName`](#SimpleAuth-Configuration-CookieStore-cookieName).

    @property cookieName
    @readOnly
    @type String
    @public
  */
  cookieName: 'ember_simple_auth:session',

  /**
    The expiration time in seconds to use for the cookie. A value of `null`
    will make the cookie a session cookie that expires when the browser is
    closed.

    This value can be configured via
    [`SimpleAuth.Configuration.CookieStore#cookieExpirationTime`](#SimpleAuth-Configuration-CookieStore-cookieExpirationTime).

    @property cookieExpirationTime
    @readOnly
    @type Integer
    @public
  */
  cookieExpirationTime: null,

  _secureCookies: window.location.protocol === 'https:',

  _syncDataTimeout: null,

  _renewExpirationTimeout: null,

  _isPageVisible: computed(function() {
    const visibilityState = document.visibilityState || 'visible';
    return visibilityState === 'visible';
  }).volatile(),

  _setup: on('init', function() {
    this._syncData();
    this._renewExpiration();
  }),

  /**
    Persists the `data` in session cookies.

    @method persist
    @param {Object} data The data to persist
    @public
  */
  persist(data) {
    data           = JSON.stringify(data || {});
    let expiration = this._calculateExpirationTime();
    this._write(data, expiration);
    this._lastData = this.restore();
  },

  /**
    Restores all data currently saved in the cookie as a plain object.

    @method restore
    @return {Object} All data currently persisted in the cookie
    @public
  */
  restore() {
    let data = this._read(this.cookieName);
    if (Ember.isEmpty(data)) {
      return {};
    } else {
      return JSON.parse(data);
    }
  },

  /**
    Clears the store by deleting all session cookies prefixed with the
    `cookieName` (see
    [`SimpleAuth.Stores.Cookie#cookieName`](#SimpleAuth-Stores-Cookie-cookieName)).

    @method clear
    @public
  */
  clear() {
    this._write(null, 0);
    this._lastData = {};
  },

  _read(name) {
    let value = document.cookie.match(new RegExp(`${name}=([^;]+)`)) || [];
    return decodeURIComponent(value[1] || '');
  },

  _calculateExpirationTime() {
    let cachedExpirationTime = this._read(`${this.cookieName}:expiration_time`);
    cachedExpirationTime     = !!cachedExpirationTime ? new Date().getTime() + cachedExpirationTime * 1000 : null;
    return !!this.cookieExpirationTime ? new Date().getTime() + this.cookieExpirationTime * 1000 : cachedExpirationTime;
  },

  _write(value, expiration) {
    let path        = '; path=/';
    let domain      = Ember.isEmpty(this.cookieDomain) ? '' : `; domain=${this.cookieDomain}`;
    let expires     = Ember.isEmpty(expiration) ? '' : `; expires=${new Date(expiration).toUTCString()}`;
    let secure      = !!this._secureCookies ? ';secure' : '';
    document.cookie = `${this.cookieName}=${encodeURIComponent(value)}${domain}${path}${expires}${secure}`;
    if (expiration !== null) {
      let cachedExpirationTime = this._read(`${this.cookieName}:expiration_time`);
      document.cookie = `${this.cookieName}:expiration_time=${encodeURIComponent(this.cookieExpirationTime || cachedExpirationTime)}${domain}${path}${expires}${secure}`;
    }
  },

  _syncData() {
    let data = this.restore();
    if (!objectsAreEqual(data, this._lastData)) {
      this._lastData = data;
      this.trigger('sessionDataUpdated', data);
    }
    if (!Ember.testing) {
      Ember.run.cancel(this._syncDataTimeout);
      this._syncDataTimeout = Ember.run.later(this, this._syncData, 500);
    }
  },

  _renew() {
    let data = this.restore();
    if (!Ember.isEmpty(data) && data !== {}) {
      data           = Ember.typeOf(data) === 'string' ? data : JSON.stringify(data || {});
      let expiration = this._calculateExpirationTime();
      this._write(data, expiration);
    }
  },

  _renewExpiration() {
    if (this.get('_isPageVisible')) {
      this._renew();
    }
    if (!Ember.testing) {
      Ember.run.cancel(this._renewExpirationTimeout);
      this._renewExpirationTimeout = Ember.run.later(this, this._renewExpiration, 60000);
    }
  }
});
