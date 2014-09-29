var defaults = {
  serverTokenEndpoint: '/users/sign_in',
  resourceName:        'user'
};

/**
  Ember Simple Auth Device's configuration object.

  To change any of these values, define a global environment object for Ember
  Simple Auth and define the values there:

  ```js
  window.ENV = window.ENV || {};
  window.ENV['simple-auth-devise'] = {
    serverTokenEndpoint: '/some/other/endpoint'
  }
  ```

  @class Devise
  @namespace SimpleAuth.Configuration
  @module simple-auth/configuration
*/
export default {
  /**
    The endpoint on the server the authenticator acquires the auth token
    and email from.

    @property serverTokenEndpoint
    @readOnly
    @static
    @type String
    @default '/users/sign_in'
  */
  serverTokenEndpoint: defaults.serverTokenEndpoint,

  /**
    The devise resource name.

    @property resourceName
    @readOnly
    @static
    @type String
    @default 'user'
  */
  resourceName: defaults.resourceName,

  /**
    @method load
    @private
  */
  load: function(container, config) {
    this.serverTokenEndpoint = config.serverTokenEndpoint || defaults.serverTokenEndpoint;
    this.resourceName        = config.resourceName || defaults.resourceName;
  }
};
