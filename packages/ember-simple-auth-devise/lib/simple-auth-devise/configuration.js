import loadConfig from 'simple-auth/utils/load-config';

var defaults = {
  serverTokenEndpoint:         '/users/sign_in',
  resourceName:                'user',
  tokenAttributeName:          'token',
  identificationAttributeName: 'email'
};

/**
  Ember Simple Auth Device's configuration object.

  To change any of these values, set them on the application's environment
  object:

  ```js
  ENV['simple-auth-devise'] = {
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
    The token attribute name.

    @property tokenAttributeName
    @readOnly
    @static
    @type String
    @default 'token'
  */
  tokenAttributeName: defaults.tokenAttributeName,

  /**
    The identification attribute name. This is the parameter that is sent to
    [serverTokenEndpoint](#SimpleAuth-Configuration-Devise-serverTokenEndpoint)
    during the authentication process, is expected in the response and is used
    by the
    [Devise authorizer](#SimpleAuth-Authorizers-Devise).

    @property identificationAttributeName
    @readOnly
    @static
    @type String
    @default 'email'
  */
  identificationAttributeName: defaults.identificationAttributeName,

  /**
    @method load
    @private
  */
  load: loadConfig(defaults)
};
