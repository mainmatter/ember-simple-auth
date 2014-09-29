import loadConfig from 'simple-auth/utils/load-config';

var defaults = {
  cookieName:           'ember_simple_auth:session',
  cookieExpirationTime: null
};

/**
  Ember Simple Auth Cookie Store's configuration object.

  To change any of these values, define a global environment object for Ember
  Simple Auth and define the values there:

  ```js
  window.ENV = window.ENV || {};
  window.ENV['simple-auth-cookie-store'] = {
    cookieName: 'my_app_auth_session'
  }
  ```

  @class CookieStore
  @namespace SimpleAuth.Configuration
  @module simple-auth/configuration
*/
export default {
  /**
    The name of the cookie the store stores its data in.

    @property cookieName
    @readOnly
    @static
    @type String
    @default 'ember_simple_auth:'
  */
  cookieName: defaults.cookieName,

  /**
    The expiration time in seconds to use for the cookie. A value of `null`
    will make the cookie a session cookie that expires when the browser is
    closed.

    @property cookieExpirationTime
    @readOnly
    @static
    @type Integer
    @default null
  */
  cookieExpirationTime: defaults.cookieExpirationTime,

  /**
    @method load
    @private
  */
  load: loadConfig(defaults)
};
