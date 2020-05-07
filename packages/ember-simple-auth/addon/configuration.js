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

  load(config) {
    this.rootURL = getWithDefault(config, 'rootURL', DEFAULTS.rootURL);
  }
};
