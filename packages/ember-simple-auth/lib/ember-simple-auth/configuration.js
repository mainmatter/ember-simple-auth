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
  authenticationRoute: 'login',

  /**
    The route to transition to after successful authentication; should be set
    through [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

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
    [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

    @property sessionPropertyName
    @readOnly
    @static
    @type String
    @default 'session'
  */
  sessionPropertyName: 'session',

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
