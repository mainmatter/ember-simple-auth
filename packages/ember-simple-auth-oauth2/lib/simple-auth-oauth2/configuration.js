import loadConfig from 'simple-auth/utils/load-config';

var defaults = {
  serverTokenEndpoint:           '/token',
  serverTokenRevocationEndpoint: null,
  refreshAccessTokens:           true
};

/**
  Ember Simple Auth OAuth2's configuration object.

  To change any of these values, set them on the application's environment
  object:

  ```js
  ENV['simple-auth-oauth2'] = {
    serverTokenEndpoint: '/some/custom/endpoint'
  }
  ```

  @class OAuth2
  @namespace SimpleAuth.Configuration
  @module simple-auth/configuration
*/
export default {
  /**
    The endpoint on the server the authenticator acquires the access token
    from.

    @property serverTokenEndpoint
    @readOnly
    @static
    @type String
    @default '/token'
  */
  serverTokenEndpoint: defaults.serverTokenEndpoint,

  /**
    The endpoint on the server the authenticator uses to revoke tokens. Only
    set this if the server actually supports token revokation.

    @property serverTokenRevocationEndpoint
    @readOnly
    @static
    @type String
    @default null
  */
  serverTokenRevocationEndpoint: defaults.serverTokenRevocationEndpoint,

  /**
    Sets whether the authenticator automatically refreshes access tokens.

    @property refreshAccessTokens
    @readOnly
    @static
    @type Boolean
    @default true
  */
  refreshAccessTokens: defaults.refreshAccessTokens,

  /**
    @method load
    @private
  */
  load: loadConfig(defaults)
};
