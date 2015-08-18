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
  },
  devise: {
    serverTokenEndpoint:         '/users/sign_in',
    resourceName:                'user',
    tokenAttributeName:          'token',
    identificationAttributeName: 'email'
  },
  oauth2: {
    serverTokenEndpoint:           '/token',
    serverTokenRevocationEndpoint: null,
    refreshAccessTokens:           true,
    clientId:                      null
  }
};

/**
  Ember Simple Auth's configuration object.

  To change any of these values, set them on the application's environment
  object:

  ```js
  ENV['simple-auth'] = {
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

  devise: {
    /**
      The endpoint on the server the authenticator acquires the auth token
      and email from.

      @property serverTokenEndpoint
      @readOnly
      @static
      @type String
      @default '/users/sign_in'
      @public
    */
    serverTokenEndpoint: defaults.devise.serverTokenEndpoint,

    /**
      The devise resource name.

      @property resourceName
      @readOnly
      @static
      @type String
      @default 'user'
      @public
    */
    resourceName: defaults.devise.resourceName,

    /**
      The token attribute name.

      @property tokenAttributeName
      @readOnly
      @static
      @type String
      @default 'token'
      @public
    */
    tokenAttributeName: defaults.devise.tokenAttributeName,

    /**
      The identification attribute name. This is the parameter that is sent to
      [serverTokenEndpoint](#SimpleAuth-Configuration-Devise-serverTokenEndpoint)
      during the authentication process, is expected in the response and is used
      by the
      [Devise authorizer](#SimpleAuth-Authorizers-Devise).

      @property identificationAttributeName
      @readOnly
      @static
      @type String
      @default 'email'
      @public
    */
    identificationAttributeName: defaults.devise.identificationAttributeName,

    /**
      @method load
      @private
    */
    load: loadConfig(defaults.devise)
  },

  oauth2: {
    /**
      The client_id sent to the server

      @property client_id
      @readOnly
      @static
      @type String
      @default null
      @public
    */
    clientId: defaults.oauth2.clientId,

    /**
      The endpoint on the server the authenticator acquires the access token
      from.

      @property serverTokenEndpoint
      @readOnly
      @static
      @type String
      @default '/token'
      @public
    */
    serverTokenEndpoint: defaults.oauth2.serverTokenEndpoint,

    /**
      The endpoint on the server the authenticator uses to revoke tokens. Only
      set this if the server actually supports token revokation.

      @property serverTokenRevocationEndpoint
      @readOnly
      @static
      @type String
      @default null
      @public
    */
    serverTokenRevocationEndpoint: defaults.oauth2.serverTokenRevocationEndpoint,

    /**
      Sets whether the authenticator automatically refreshes access tokens.

      @property refreshAccessTokens
      @readOnly
      @static
      @type Boolean
      @default true
      @public
    */
    refreshAccessTokens: defaults.oauth2.refreshAccessTokens,

    /**
      @method load
      @private
    */
    load: loadConfig(defaults.oauth2)
  },

  load(config) {
    Ember.A(['base', 'localStorage', 'cookie', 'devise', 'oauth2']).forEach((section) => {
      this[section].load(config[section]);
    });
  }
};
