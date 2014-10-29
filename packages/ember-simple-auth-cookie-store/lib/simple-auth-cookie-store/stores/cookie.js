import Base from 'simple-auth/stores/base';
import flatObjectsAreEqual from 'simple-auth/utils/flat-objects-are-equal';
import Configuration from './../configuration';

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
  import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

  export default Ember.Controller.extend(LoginControllerMixin, {
    rememberMe: false,

    rememberMeChanged: function() {
      this.get('session.store').cookieExpirationTime = this.get('rememberMe') ? (14 * 24 * 60 * 60) : null;
    }.observes('rememberMe')
  });
  ```

  _The factory for this store is registered as
  `'simple-auth-session-store:cookie'` in Ember's container._

  @class Cookie
  @namespace SimpleAuth.Stores
  @module simple-auth-cookie-store/stores/cookie
  @extends Stores.Base
*/
export default Base.extend({

  /**
    The domain to use for the cookie. E.g., "example.com", ".example.com" (includes all subdomains)
    or "subdomain.example.com"; if not specified, defaults to the host portion of the
    current document location (string or null).

    This value can be configured via the global environment object:

    ```js
    window.ENV = window.ENV || {};
    window.ENV['simple-auth-cookie-store'] = {
      cookieDomain: '.example.com'
    }
    ```

    @property cookieDomain
    @type String
    @default null
  */
  cookieDomain: null,

  /**
    The name of the cookie the store stores its data in.

    This value can be configured via
    [`SimpleAuth.Configuration.CookieStore#cookieName`](#SimpleAuth-Configuration-CookieStore-cookieName).

    @property cookieName
    @readOnly
    @type String
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
  */
  cookieExpirationTime: null,

  /**
    @property _secureCookies
    @private
  */
  _secureCookies: window.location.protocol === 'https:',

  /**
    @property _syncDataTimeout
    @private
  */
  _syncDataTimeout: null,

  /**
    @method init
    @private
  */
  init: function() {
    this.cookieName           = Configuration.cookieName;
    this.cookieExpirationTime = Configuration.cookieExpirationTime;
    this.cookieDomain         = Configuration.cookieDomain;
    this.syncData();
  },

  /**
    Persists the `data` in session cookies.

    @method persist
    @param {Object} data The data to persist
  */
  persist: function(data) {
    data           = JSON.stringify(data || {});
    var expiration = !!this.cookieExpirationTime ? new Date().getTime() + this.cookieExpirationTime * 1000 : null;
    this.write(data, expiration);
    this._lastData = this.restore();
  },

  /**
    Restores all data currently saved in the cookie as a plain object.

    @method restore
    @return {Object} All data currently persisted in the cookie
  */
  restore: function() {

    var data = this.read();
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
  */
  clear: function() {
    this.write(null, 0);
    this._lastData = null;
  },

  /**
    @method read
    @private
  */
  read: function() {
    var value = document.cookie.match(new RegExp(this.cookieName + name + '=([^;]+)')) || [];
    return decodeURIComponent(value[1] || '');
  },

  /**
    @method write
    @private
  */
  write: function(value, expiration) {
    var path    = '; path=/';
    var domain  = Ember.isEmpty(this.cookieDomain) ? '' : '; domain=' + this.cookieDomain;
    var expires = Ember.isEmpty(expiration) ? '' : '; expires=' + new Date(expiration).toUTCString();
    var secure  = !!this._secureCookies ? ';secure' : '';
    document.cookie = this.cookieName + '=' + encodeURIComponent(value) + domain + path + expires + secure;
  },

  /**
    @method syncData
    @private
  */
  syncData: function() {
    var data = this.restore();
    if (!flatObjectsAreEqual(data, this._lastData)) {
      this._lastData = data;
      this.trigger('sessionDataUpdated', data);
    }
    if (!Ember.testing) {
      Ember.run.cancel(this._syncDataTimeout);
      this._syncDataTimeout = Ember.run.later(this, this.syncData, 500);
    }
  }
});
