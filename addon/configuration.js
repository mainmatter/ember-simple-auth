import Ember from 'ember';

const { getWithDefault, typeOf, deprecate } = Ember;

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
    baseURL: 'path/to/base/url'
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
    @deprecated AuthenticatedRouteMixin/authenticationRoute:property
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
    @deprecated ApplicationRouteMixin/routeAfterAuthentication:property
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
    @deprecated UnauthenticatedRouteMixin/routeIfAlreadyAuthenticated:property
    @readOnly
    @static
    @type String
    @default 'index'
    @public
  */
  routeIfAlreadyAuthenticated: DEFAULTS.routeIfAlreadyAuthenticated,

  load(config) {
    for (let property in this) {
      if (this.hasOwnProperty(property) && typeOf(this[property]) !== 'function') {
        if (['authenticationRoute', 'routeAfterAuthentication', 'routeIfAlreadyAuthenticated'].indexOf(property) >= 0 && DEFAULTS[property] !== this[property]) {
          deprecate(`Ember Simple Auth: ${property} should no longer be overridden in the configuration. Instead, override the ${property} property in the route.`, false, {
            id: `ember-simple-auth.configuration.routes`,
            until: '2.0.0'
          });
        }

        this[property] = getWithDefault(config, property, DEFAULTS[property]);
      }
    }
  }
};
