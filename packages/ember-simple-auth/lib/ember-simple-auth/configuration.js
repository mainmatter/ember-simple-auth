var globalConfig = (global.ENV || {})['ember-simple-auth'] || {};

/**
  Ember.SimpleAuth's configuration object.

  @class Configuration
  @namespace $mainModule
*/
export default {
  /**
    The route to transition to for authentication; should be set through
    [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

    @property authenticationRoute
    @readOnly
    @static
    @type String
    @default 'login'
  */
  authenticationRoute: globalConfig.authenticationRoute || 'login',

  /**
    The route to transition to after successful authentication; should be set
    through [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

    @property routeAfterAuthentication
    @readOnly
    @static
    @type String
    @default 'index'
  */
  routeAfterAuthentication: globalConfig.routeAfterAuthentication || 'index',

  /**
    The name of the property that the session is injected with into routes and
    controllers; should be set through
    [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

    @property sessionPropertyName
    @readOnly
    @static
    @type String
    @default 'session'
  */
  sessionPropertyName: globalConfig.sessionPropertyName || 'session',

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
  authorizerFactory: globalConfig.authorizerFactory || null,

  /**
    The store factory to use as it is registered with Ember's container, see
    [Ember's API docs](http://emberjs.com/api/classes/Ember.Application.html#method_register).

    @property storeFactory
    @readOnly
    @static
    @type String
    @default ember-simple-auth-session-store:local-storage
  */
  storeFactory: globalConfig.storeFactory || 'ember-simple-auth-session-store:local-storage',

  /**
    Ember.SimpleAuth will never authorize requests going to a different origin
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
  crossOriginWhitelist: globalConfig.crossOriginWhitelist || [],

  /**
    @property applicationRootUrl
    @static
    @private
    @type String
  */
  applicationRootUrl: null,

  /**
    @property extensionInitializers
    @static
    @private
    @type Array
  */
  extensionInitializers: []
};
