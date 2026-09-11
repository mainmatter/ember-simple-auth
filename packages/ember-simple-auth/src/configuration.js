const DEFAULTS = {
  rootURL: '',
  routeAfterAuthentication: 'index',
  useResolver: true,
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
    When `true`, the session service looks up `session:main`, session stores,
    and authenticators from the resolver. When `false`, it constructs
    `InternalSession` and the store via `createSessionStore`, and authenticators
    via `createAuthenticator`.

    @memberof Configuration
    @property useResolver
    @static
    @type Boolean
    @default true
    @public
  */
  useResolver: DEFAULTS.useResolver,

  load(config) {
    this.rootURL = config.rootURL !== undefined ? config.rootURL : DEFAULTS.rootURL;
    this.routeAfterAuthentication =
      config.routeAfterAuthentication !== undefined
        ? config.routeAfterAuthentication
        : DEFAULTS.routeAfterAuthentication;
    this.useResolver = config.useResolver !== undefined ? config.useResolver : DEFAULTS.useResolver;
  },
};
