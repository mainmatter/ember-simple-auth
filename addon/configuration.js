import { getWithDefault } from '@ember/object';

const DEFAULTS = {
  rootURL: '',
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
    @type String
    @default 'index'
    @public
  */
  routeAfterAuthentication: 'index',

  load(config) {
    this.rootURL = getWithDefault(config, 'rootURL', DEFAULTS.rootURL);
  }
};
