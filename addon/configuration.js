import Ember from 'ember';
import loadConfig from './utils/load-config';

const defaults = {
  base: {
    authenticationRoute:         'login',
    routeAfterAuthentication:    'index',
    routeIfAlreadyAuthenticated: 'index',
    store:                       'session-store:ephemeral'
  },
  localStorage: {
    key: 'ember_simple_auth:session'
  },
  cookie: {
    name:           'ember_simple_auth:session',
    domain:         null,
    expirationTime: null
  }
};

/**
  Ember Simple Auth's configuration object.

  To change any of these values, set them on the application's environment
  object:

  ```js
  ENV['ember-simple-auth'] = {
    authenticationRoute: 'sign-in'
  };
  ```

  @class Configuration
  @module ember-simple-auth/configuration
  @public
*/
export default {
  base: {
    /**
      The route to transition to for authentication.

      @property authenticationRoute
      @readOnly
      @static
      @type String
      @default 'login'
      @public
    */
    authenticationRoute: defaults.base.authenticationRoute,

    /**
      The route to transition to after successful authentication.

      @property routeAfterAuthentication
      @readOnly
      @static
      @type String
      @default 'index'
      @public
    */
    routeAfterAuthentication: defaults.base.routeAfterAuthentication,

    /**
      The route to transition to if a route that implements
      [`UnauthenticatedRouteMixin`](#SimpleAuth-UnauthenticatedRouteMixin) is
      accessed when the session is authenticated.

      @property routeIfAlreadyAuthenticated
      @readOnly
      @static
      @type String
      @default 'index'
      @public
    */
    routeIfAlreadyAuthenticated: defaults.base.routeIfAlreadyAuthenticated,

    /**
      The store store the session data in.

      @property store
      @readOnly
      @static
      @type String
      @default 'index'
      @public
    */
    store: defaults.base.store,

    /**
      The session factory to use as it is registered with Ember's container,
      see
      [Ember's API docs](http://emberjs.com/api/classes/Ember.Application.html#method_register).

      @property session
      @readOnly
      @static
      @type String
      @default 'session:main'
      @public
    */
    session: defaults.base.session,

    /**
      @method load
      @private
    */
    load: loadConfig(defaults.base)
  },

  localStorage: {
    /**
      The key the localStorage store stores the data in.

      @property key
      @type String
      @default 'ember_simple_auth:session'
      @public
    */
    key: defaults.localStorage.key,

    /**
      @method load
      @private
    */
    load: loadConfig(defaults.localStorage)
  },

  cookie: {
    /**
      The domain to use for the cookie store's cookie, e.g., "example.com"
      ".example.com" (includes all subdomains) or "subdomain.example.com". If not
      configured the cookie domain defaults to the domain the session was
      authneticated on.

      This value can be configured via
      [`SimpleAuth.Configuration.CookieStore#cookieDomain`](#SimpleAuth-Configuration-CookieStore-cookieDomain).

      @property cookieDomain
      @type String
      @default null
      @public
    */
    domain: defaults.cookie.domain,

    /**
      The name of the cookie the cookie store stores its data in.

      @property cookieName
      @readOnly
      @static
      @type String
      @default 'ember_simple_auth:'
      @public
    */
    name: defaults.cookie.name,

    /**
      The expiration time in seconds to use for the cookie store's cookie. A
      value of `null` will make the cookie a session cookie that expires when
      the browser is closed.

      @property cookieExpirationTime
      @readOnly
      @static
      @type Integer
      @default null
      @public
    */
    expirationTime: defaults.cookie.expirationTime,

    /**
      @method load
      @private
    */
    load: loadConfig(defaults.cookie)
  },

  load(config) {
    Ember.A(['base', 'localStorage', 'cookie']).forEach((section) => {
      this[section].load(config[section]);
    });
  }
};
