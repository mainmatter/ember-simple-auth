import getGlobalConfig from './utils/get-global-config';

/**
  Ember Simple Auth's configuration object.

  To change any of these values, define a global environment object for Ember
  Simple Auth and define the values there:

  ```javascript
  window.ENV = window.ENV || {};
  window.ENV['simple-auth'] = {
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
  authenticationRoute: 'login',

  /**
    The route to transition to after successful authentication.

    @property routeAfterAuthentication
    @readOnly
    @static
    @type String
    @default 'index'
  */
  routeAfterAuthentication: 'index',

  /**
    The name of the property that the session is injected with into routes and
    controllers.

    @property sessionPropertyName
    @readOnly
    @static
    @type String
    @default 'session'
  */
  sessionPropertyName: 'session',

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
  authorizer: null,

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
  session: 'simple-auth-session:main',

  /**
    The store factory to use as it is registered with Ember's container, see
    [Ember's API docs](http://emberjs.com/api/classes/Ember.Application.html#method_register).

    @property store
    @readOnly
    @static
    @type String
    @default simple-auth-session-store:local-storage
  */
  store: 'simple-auth-session-store:local-storage',

  /**
    Ember Simple Auth will never authorize requests going to a different origin
    than the one the Ember.js application was loaded from; to explicitely
    enable authorization for additional origins, whitelist those origins with
    this setting. _Beware that origins consist of protocol, host and port (port
    can be left out when it is 80 for HTTP or 443 for HTTPS)_

    @property crossOriginWhitelist
    @readOnly
    @static
    @type Array
    @default []
  */
  crossOriginWhitelist: [],

  /**
    @property applicationRootUrl
    @private
  */
  applicationRootUrl: null,

  /**
    @method load
    @private
  */
  load: function(container) {
    var globalConfig              = getGlobalConfig('simple-auth');
    this.authenticationRoute      = globalConfig.authenticationRoute || this.authenticationRoute;
    this.routeAfterAuthentication = globalConfig.routeAfterAuthentication || this.routeAfterAuthentication;
    this.sessionPropertyName      = globalConfig.sessionPropertyName || this.sessionPropertyName;
    this.authorizer               = globalConfig.authorizer || this.authorizer;
    this.session                  = globalConfig.session || this.session;
    this.store                    = globalConfig.store || this.store;
    this.crossOriginWhitelist     = globalConfig.crossOriginWhitelist || this.crossOriginWhitelist;
    this.applicationRootUrl       = container.lookup('router:main').get('rootURL') || '/';
  }
};
