const DEFAULTS = {
  rootURL: '',
  routeAfterAuthentication: 'index',
  useInternalSessionLookup: true,
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

  /**
    When `true`, the session service looks up `session:main` from the resolver.
    When `false`, the session service constructs `InternalSession` itself.

    @memberof Configuration
    @property useInternalSessionLookup
    @static
    @type Boolean
    @default true
    @public
  */
  useInternalSessionLookup: DEFAULTS.useInternalSessionLookup,

  load(config) {
    this.rootURL = config.rootURL !== undefined ? config.rootURL : DEFAULTS.rootURL;
    this.routeAfterAuthentication =
      config.routeAfterAuthentication !== undefined
        ? config.routeAfterAuthentication
        : DEFAULTS.routeAfterAuthentication;
    this.useInternalSessionLookup =
      config.useInternalSessionLookup !== undefined
        ? config.useInternalSessionLookup
        : DEFAULTS.useInternalSessionLookup;
  },
};
