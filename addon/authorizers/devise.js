import Ember from 'ember';
import Base from './base';
import Configuration from './../configuration';

/**
  Authorizer that works with the Ruby gem
  [Devise](https://github.com/plataformatec/devise) by sending the `token` and
  `email` properties from the session in the `Authorization` header.

  __As token authentication is not actually part of devise anymore, the server
  needs to implement some customizations__ to work with this authenticator -
  see the README for more information.

  _The factory for this authorizer is registered as
  `'simple-auth-authorizer:devise'` in Ember's container._

  @class Devise
  @namespace Authorizers
  @module authorizers/devise
  @extends Base
  @public
*/
export default Base.extend({
  /**
    The token attribute name.

    This value can be configured via
    [`SimpleAuth.Configuration.Devise#tokenAttributeName`](#SimpleAuth-Configuration-Devise-tokenAttributeName).

    @property tokenAttributeName
    @type String
    @default 'token'
    @public
  */
  tokenAttributeName: 'token',

  /**
    The identification attribute name.

    This value can be configured via
    [`SimpleAuth.Configuration.Devise#identificationAttributeName`](#SimpleAuth-Configuration-Devise-identificationAttributeName).

    @property identificationAttributeName
    @type String
    @default 'email'
    @public
  */
  identificationAttributeName: 'email',

  /**
    @method init
    @private
  */
  init() {
    this.tokenAttributeName          = Configuration.devise.tokenAttributeName;
    this.identificationAttributeName = Configuration.devise.identificationAttributeName;
  },

  /**
    Authorizes an XHR request by sending the `token` and `email`
    properties from the session in the `Authorization` header:

    ```
    Authorization: Token <tokenAttributeName>="<token>", <identificationAttributeName>="<user identification>"
    ```

    @method authorize
    @param {jqXHR} jqXHR The XHR request to authorize (see http://api.jquery.com/jQuery.ajax/#jqXHR)
    @param {Object} requestOptions The options as provided to the `$.ajax` method (see http://api.jquery.com/jQuery.ajaxPrefilter/)
    @public
  */
  authorize(jqXHR) {
    let secureData         = this.get('session.secure');
    let userToken          = secureData[this.tokenAttributeName];
    let userIdentification = secureData[this.identificationAttributeName];
    if (this.get('session.isAuthenticated') && !Ember.isEmpty(userToken) && !Ember.isEmpty(userIdentification)) {
      let authData = `${this.tokenAttributeName}="${userToken}", ${this.identificationAttributeName}="${userIdentification}"`;
      jqXHR.setRequestHeader('Authorization', `Token ${authData}`);
    }
  }
});
