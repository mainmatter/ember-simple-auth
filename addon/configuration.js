import Ember from 'ember';

const { getWithDefault } = Ember;

const DEFAULTS = {
  baseURL:                     '',
  authenticationRoute:         'login',
  routeAfterAuthentication:    'index',
  routeIfAlreadyAuthenticated: 'index'
};

/**
  Ember Simple Auth's configuration object.

  To change any of these values, set them on the application's environment
  object, e.g.:

  ```js
  // config/environment.js
  ENV['ember-simple-auth'] = {
    authenticationRoute: 'sign-in'
  };
  ```

  @class Configuration
  @extends Object
  @module ember-simple-auth/configuration
  @public
*/
export default {
  /**
    The base URL of the application as configured in `config/environment.js`.

    @property baseURL
    @readOnly
    @static
    @type String
    @default ''
    @public
  */
  baseURL: DEFAULTS.baseURL,

  /**
    The route to transition to for authentication. The
    {{#crossLink "AuthenticatedRouteMixin"}}{{/crossLink}} will transition to
    this route when a route that implements the mixin is accessed when the
    route is not authenticated.

    @property authenticationRoute
    @readOnly
    @static
    @type String
    @default 'login'
    @public
  */
  authenticationRoute: DEFAULTS.authenticationRoute,

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
    The route to transition to if a route that implements the
    {{#crossLink "UnauthenticatedRouteMixin"}}{{/crossLink}} is accessed when
    the session is authenticated.

    @property routeIfAlreadyAuthenticated
    @readOnly
    @static
    @type String
    @default 'index'
    @public
  */
  routeIfAlreadyAuthenticated: DEFAULTS.routeIfAlreadyAuthenticated,

  load(config) {
    for (let property in this) {
      if (this.hasOwnProperty(property) && Ember.typeOf(this[property]) !== 'function') {
        this[property] = getWithDefault(config, property, DEFAULTS[property]);
      }
    }
  }
};
