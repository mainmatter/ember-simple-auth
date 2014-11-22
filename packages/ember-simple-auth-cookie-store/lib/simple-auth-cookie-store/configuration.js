import loadConfig from 'simple-auth/utils/load-config';

var defaults = {
  cookieName:           'ember_simple_auth:session',
  cookieDomain:         null,
  cookieExpirationTime: null
};

/**
  Ember Simple Auth Cookie Store's configuration object.

  To change any of these values, set them on the application's environment
  object:

  ```js
  ENV['simple-auth-cookie-store'] = {
    cookieName: 'my_app_auth_session'
  }
  ```

  @class CookieStore
  @namespace SimpleAuth.Configuration
  @module simple-auth/configuration
*/
export default {

  /**
    The domain to use for the cookie, e.g., "example.com", ".example.com"
    (includes all subdomains) or "subdomain.example.com". If not configured the
    cookie domain defaults to the domain the session was authneticated on.

    This value can be configured via
    [`SimpleAuth.Configuration.CookieStore#cookieDomain`](#SimpleAuth-Configuration-CookieStore-cookieDomain).

    @property cookieDomain
    @type String
    @default null
  */
  cookieDomain: defaults.cookieDomain,

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
