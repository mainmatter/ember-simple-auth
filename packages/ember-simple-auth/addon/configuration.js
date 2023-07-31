const DEFAULTS = {
  rootURL: '',
  routeAfterInvalidation: '',
  routeAfterAuthentication: 'index',
};

/**
  Ember Simple Auth's configuration object.

  @class Configuration
  @extends Object
  @module ember-simple-auth/configuration
  @public
*/
export default {
  /**
    The root URL of the application as configured in `config/environment.js`.

    @property rootURL
    @readOnly
    @static
    @type String
    @default ''
    @public
  */
  rootURL: DEFAULTS.rootURL,
  

  /**
    The route to transition to after successful invalidation.

    @property routeAfterInvalidation
    @readOnly
    @static
    @type String
    @default ''
    @public
  */
  routeAfterInvalidation: DEFAULTS.routeAfterInvalidation,


  /**
    The route to transition to after successful authentication.

    @property routeAfterAuthentication
    @readOnly
    @static
    @type String
    @default 'index'
    @public
  */
  routeAfterAuthentication: DEFAULTS.routeAfterAuthentication,

  load(config) {
    this.rootURL = config.rootURL !== undefined ? config.rootURL : DEFAULTS.rootURL;
    
    this.routeAfterInvalidation =
      config.routeAfterInvalidation !== undefined
        ? config.routeAfterInvalidation
        : DEFAULTS.routeAfterInvalidation;
    
    this.routeAfterAuthentication =
      config.routeAfterAuthentication !== undefined
        ? config.routeAfterAuthentication
        : DEFAULTS.routeAfterAuthentication;
  },
};
