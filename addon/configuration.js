import Ember from 'ember';
import applyConfig from './utils/apply-config';

const DEFAULTS = {
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
    base: {
      authenticationRoute: 'sign-in'
    }
  };
  ```

  @class Configuration
  @module ember-simple-auth/configuration
  @public
*/
export default {
  /**
    @property {Object} base
       @property {String} base.authenticationRoute
       @property {String} base.routeAfterAuthentication
       @property {String} base.routeIfAlreadyAuthenticated
       @property {String} base.store
    @public
   */
  base: {
    /**
      The route to transition to for authentication.

      @property base.authenticationRoute
      @readOnly
      @static
      @type String
      @default 'login'
      @public
    */
    authenticationRoute: DEFAULTS.base.authenticationRoute,

    /**
      The route to transition to after successful authentication.

      @property base.routeAfterAuthentication
      @readOnly
      @static
      @type String
      @default 'index'
      @public
    */
    routeAfterAuthentication: DEFAULTS.base.routeAfterAuthentication,

    /**
      The route to transition to if a route that implements
      [`UnauthenticatedRouteMixin`](#SimpleAuth-UnauthenticatedRouteMixin) is
      accessed when the session is authenticated.

      @property base.routeIfAlreadyAuthenticated
      @readOnly
      @static
      @type String
      @default 'index'
      @public
    */
    routeIfAlreadyAuthenticated: DEFAULTS.base.routeIfAlreadyAuthenticated,

    /**
      The store to store the session data in.

      @property base.store
      @readOnly
      @static
      @type String
      @default 'session-store:ephemeral'
      @public
    */
    store: DEFAULTS.base.store,

    /**
      @method base.load
      @private
    */
    load: applyConfig(DEFAULTS.base)
  },

  /**
    @property {Object} localStorage
      @property {String} key
    @public
  */
  localStorage: {
    /**
      The key the localStorage store stores the data in.

      @property localStorage.key
      @type String
      @default 'ember_simple_auth:session'
      @public
    */
    key: DEFAULTS.localStorage.key,

    /**
      @method load
      @private
    */
    load: applyConfig(DEFAULTS.localStorage)
  },

  /**
    @property {Object} cookie
      @property {String} domain
      @property {String} name
      @property {Integer} expirationTime
    @public
  */
  cookie: {
    /**
      The domain to use for the cookie store's cookie, e.g., "example.com"
      ".example.com" (includes all subdomains) or "subdomain.example.com". If not
      configured the cookie domain defaults to the domain the session was
      authenticated on.

      @property cookie.domain
      @type String
      @default null
      @public
    */
    domain: DEFAULTS.cookie.domain,

    /**
      The name of the cookie the cookie store stores its data in.

      @property cookie.name
      @readOnly
      @static
      @type String
      @default 'ember_simple_auth:'
      @public
    */
    name: DEFAULTS.cookie.name,

    /**
      The expiration time in seconds to use for the cookie store's cookie. A
      value of `null` will make the cookie a session cookie that expires when
      the browser is closed.

      @property cookie.expirationTime
      @readOnly
      @static
      @type Integer
      @default null
      @public
    */
    expirationTime: DEFAULTS.cookie.expirationTime,

    /**
      @method load
      @private
    */
    load: applyConfig(DEFAULTS.cookie)
  },

  load(config = {}) {
    Ember.A(['base', 'localStorage', 'cookie']).forEach((section) => {
      this[section].load(config[section]);
    });
  }
};
