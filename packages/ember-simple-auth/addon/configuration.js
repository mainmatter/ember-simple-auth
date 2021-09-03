import useSessionSetupMethod from 'ember-simple-auth/use-session-setup-method';

const DEFAULTS = {
  rootURL: '',
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
    The route to transition to after successful authentication.

    @property routeAfterAuthentication
    @readOnly
    @static
    @type String
    @default 'index'
    @public
  */
  routeAfterAuthentication: DEFAULTS.routeAfterAuthentication,

  /**
    Flag used to determine whether users have decided to setup session service themselves.
    This lets us to return early from initializer which would setup the service automatically.

    This will be the default behavior in the future.

    @property useSessionSetupMethod
    @default false
    @private
  */
  useSessionSetupMethod,

  load(config) {
    this.rootURL = config.rootURL !== undefined ? config.rootURL : DEFAULTS.rootURL;
    this.routeAfterAuthentication =
      config.routeAfterAuthentication !== undefined
        ? config.routeAfterAuthentication
        : DEFAULTS.routeAfterAuthentication;
  },
};
