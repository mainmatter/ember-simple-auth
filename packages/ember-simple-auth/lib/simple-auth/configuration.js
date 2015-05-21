import loadConfig from 'simple-auth/utils/load-config';

var defaults = {
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
    authorized requests, no authorizer is needed.

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
  load: loadConfig(defaults, function(container, config) {
    this.applicationRootUrl = container.lookup('router:main').get('rootURL') || '/';
  })
};
