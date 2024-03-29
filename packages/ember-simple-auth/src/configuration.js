const DEFAULTS = {
  rootURL: '',
  routeAfterAuthentication: 'index',
};

/**
  Ember Simple Auth's configuration object.

  @class Configuration
  @extends Object
  @public
*/
export default {
  /**
    The root URL of the application as configured in `config/environment.js`.
    @memberof Configuration
    @property rootURL
    @readOnly
    @static
    @type String
    @default ''
    @public
  */
  rootURL: DEFAULTS.rootURL,

  /**
    The route to transition to after successful authentication.

    @memberof Configuration
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
    this.routeAfterAuthentication =
      config.routeAfterAuthentication !== undefined
        ? config.routeAfterAuthentication
        : DEFAULTS.routeAfterAuthentication;
  },
};
