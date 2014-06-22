/**
  SimpleAuth's configuration object.

  @class Configuration
  @namespace $root
*/
export default {
  /**
    The route to transition to for authentication; should be set through
    [SimpleAuth.setup](#Ember-SimpleAuth-setup).

    @property authenticationRoute
    @readOnly
    @static
    @type String
    @default 'login'
  */
  authenticationRoute: 'login',

  /**
    The route to transition to after successful authentication; should be set
    through [SimpleAuth.setup](#Ember-SimpleAuth-setup).

    @property routeAfterAuthentication
    @readOnly
    @static
    @type String
    @default 'index'
  */
  routeAfterAuthentication: 'index',

  /**
    The name of the property that the session is injected with into routes and
    controllers; should be set through
    [SimpleAuth.setup](#Ember-SimpleAuth-setup).

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

    @property sessionPropertyName
    @readOnly
    @static
    @type String
    @default null
  */
  authorizerFactory: null,

  /**
    The store factory to use as it is registered with Ember's container, see
    [Ember's API docs](http://emberjs.com/api/classes/Ember.Application.html#method_register).

    @property storeFactory
    @readOnly
    @static
    @type String
    @default simple-auth-session-store:local-storage
  */
  storeFactory: 'simple-auth-session-store:local-storage',

  /**
    SimpleAuth will never authorize requests going to a different origin
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
    var globalConfig = (global.ENV || {})['simple-auth'] || {};
    this.authenticationRoute      = globalConfig.authenticationRoute || this.authenticationRoute;
    this.routeAfterAuthentication = globalConfig.routeAfterAuthentication || this.routeAfterAuthentication;
    this.sessionPropertyName      = globalConfig.sessionPropertyName || this.sessionPropertyName;
    this.authorizerFactory        = globalConfig.authorizerFactory || this.authorizerFactory;
    this.storeFactory             = globalConfig.storeFactory || this.storeFactory;
    this.applicationRootUrl       = container.lookup('router:main').get('rootURL') || '/';
  }
};
