import loadConfig from 'simple-auth/utils/load-config';

var defaults = {
  serverTokenEndpoint: '/users/sign_in',
  resourceName:        'user',
  tokenAttributeName:  'user_token',
  emailAttributeName:  'user_email'
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
    The token attribute name

    @property tokenAttributeName
    @readOnly
    @static
    @type String
    @default 'user_token'
  */
  tokenAttributeName: defaults.tokenAttributeName,

  /**
    The email attribute name

    @property emailAttributeName
    @readOnly
    @static
    @type String
    @default 'user_email'
  */
  emailAttributeName: defaults.emailAttributeName,

  /**
    @method load
    @private
  */
  load: loadConfig(defaults)
};
