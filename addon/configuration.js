import Ember from 'ember';
import loadConfig from './utils/load-config';

var defaults = {
  base: {
    authenticationRoute:         'login',
    routeAfterAuthentication:    'index',
    routeIfAlreadyAuthenticated: 'index',
    sessionPropertyName:         'session',
    authorizer:                  null,
    session:                     'simple-auth-session:main',
    store:                       'simple-auth-session-store:local-storage',
    localStorageKey:             'ember_simple_auth:session',
    crossOriginWhitelist:        [],
    applicationRootUrl:          null
  },
  cookie: {
    name:           'ember_simple_auth:session',
    domain:         null,
    expirationTime: null,
  },
  devise: {
    serverTokenEndpoint:         '/users/sign_in',
    resourceName:                'user',
    tokenAttributeName:          'token',
    identificationAttributeName: 'email',
  },
  oauth2: {
    serverTokenEndpoint:           '/token',
    serverTokenRevocationEndpoint: null,
    refreshAccessTokens:           true
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
  @namespace SimpleAuth
  @module simple-auth/configuration
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
    */
    authenticationRoute: defaults.authenticationRoute,

    /**
      The route to transition to after successful authentication.

      @property routeAfterAuthentication
      @readOnly
      @static
      @type String
      @default 'index'
    */
    routeAfterAuthentication: defaults.routeAfterAuthentication,

    /**
      The route to transition to if a route that implements
      [`UnauthenticatedRouteMixin`](#SimpleAuth-UnauthenticatedRouteMixin) is
      accessed when the session is authenticated.

      @property routeIfAlreadyAuthenticated
      @readOnly
      @static
      @type String
      @default 'index'
    */
    routeIfAlreadyAuthenticated: defaults.routeIfAlreadyAuthenticated,

    /**
      The name of the property that the session is injected with into routes and
      controllers.

      @property sessionPropertyName
      @readOnly
      @static
      @type String
      @default 'session'
    */
    sessionPropertyName: defaults.sessionPropertyName,

    /**
      The authorizer factory to use as it is registered with Ember's container,
      see
      [Ember's API docs](http://emberjs.com/api/classes/Ember.Application.html#method_register);
      when the application does not interact with a server that requires
      authorized requests, no auzthorizer is needed.

      @property authorizer
      @readOnly
      @static
      @type String
      @default null
    */
    authorizer: defaults.authorizer,

    /**
      The session factory to use as it is registered with Ember's container,
      see
      [Ember's API docs](http://emberjs.com/api/classes/Ember.Application.html#method_register).

      @property session
      @readOnly
      @static
      @type String
      @default 'simple-auth-session:main'
    */
    session: defaults.session,

    /**
      The store factory to use as it is registered with Ember's container, see
      [Ember's API docs](http://emberjs.com/api/classes/Ember.Application.html#method_register).

      @property store
      @readOnly
      @static
      @type String
      @default simple-auth-session-store:local-storage
    */
    store: defaults.store,

    /**
      The key the store stores the data in.

      @property localStorageKey
      @type String
      @default 'ember_simple_auth:session'
    */
    localStorageKey: defaults.localStorageKey,

    /**
      Ember Simple Auth will never authorize requests going to a different origin
      than the one the Ember.js application was loaded from; to explicitely
      enable authorization for additional origins, whitelist those origins with
      this setting. _Beware that origins consist of protocol, host and port (port
      can be left out when it is 80 for HTTP or 443 for HTTPS)_, e.g.
      `http://domain.com:1234`, `https://external.net`. You can also whitelist
      all subdomains for a specific domain using wildcard expressions e.g.
      `http://*.domain.com:1234`, `https://*.external.net` or whitelist all
      external origins by specifying `['*']`.

      @property crossOriginWhitelist
      @readOnly
      @static
      @type Array
      @default []
    */
    crossOriginWhitelist: defaults.crossOriginWhitelist,

    /**
      @property applicationRootUrl
      @private
    */
    applicationRootUrl: defaults.applicationRootUrl,

    /**
      @method load
      @private
    */
    load: loadConfig(defaults.base, function(container) {
      this.applicationRootUrl = container.lookup('router:main').get('rootURL') || '/';
    })
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
    */
    domain: defaults.cookieDomain,

    /**
      The name of the cookie the cookie store stores its data in.

      @property cookieName
      @readOnly
      @static
      @type String
      @default 'ember_simple_auth:'
    */
    name: defaults.cookieName,

    /**
      The expiration time in seconds to use for the cookie store's cookie. A
      value of `null` will make the cookie a session cookie that expires when
      the browser is closed.

      @property cookieExpirationTime
      @readOnly
      @static
      @type Integer
      @default null
    */
    expirationTime: defaults.cookieExpirationTime,

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
    */
    serverTokenEndpoint: defaults.serverTokenEndpoint,

    /**
      The devise resource name.

      @property resourceName
      @readOnly
      @static
      @type String
      @default 'user'
    */
    resourceName: defaults.resourceName,

    /**
      The token attribute name.

      @property tokenAttributeName
      @readOnly
      @static
      @type String
      @default 'token'
    */
    tokenAttributeName: defaults.tokenAttributeName,

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
    */
    identificationAttributeName: defaults.identificationAttributeName,

    /**
      @method load
      @private
    */
    load: loadConfig(defaults.devise)
  },

  oauth2: {
    /**
      The endpoint on the server the authenticator acquires the access token
      from.

      @property serverTokenEndpoint
      @readOnly
      @static
      @type String
      @default '/token'
    */
    serverTokenEndpoint: defaults.serverTokenEndpoint,

    /**
      The endpoint on the server the authenticator uses to revoke tokens. Only
      set this if the server actually supports token revokation.

      @property serverTokenRevocationEndpoint
      @readOnly
      @static
      @type String
      @default null
    */
    serverTokenRevocationEndpoint: defaults.serverTokenRevocationEndpoint,

    /**
      Sets whether the authenticator automatically refreshes access tokens.

      @property refreshAccessTokens
      @readOnly
      @static
      @type Boolean
      @default true
    */
    refreshAccessTokens: defaults.refreshAccessTokens,

    /**
      @method load
      @private
    */
    load: loadConfig(defaults.oauth2)
  },

  load: function(container, config) {
    Ember.A(['base', 'cookie', 'devise', 'oauth2']).forEach(function(section) {
      this[section].load(container, config[section]);
    }.bind(this));
  }
};
