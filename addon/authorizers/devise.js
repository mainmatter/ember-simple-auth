import Ember from 'ember';
import Base from './base';

const { isEmpty } = Ember;

/**
  Authorizer that works with the Ruby gem
  [Devise](https://github.com/plataformatec/devise) by sending the `token` and
  `email` properties from the session in the `Authorization` header.

  __As token authentication is not actually part of devise anymore, the server
  needs to implement some customizations__ to work with this authenticator -
  see the README for more information.

  @class DeviseAuthorizer
  @module ember-simple-auth/authorizers/devise
  @extends BaseAuthorizer
  @public
*/
export default Base.extend({
  /**
    The token attribute name.

    @property tokenAttributeName
    @type String
    @default 'token'
    @public
  */
  tokenAttributeName: 'token',

  /**
    The identification attribute name.

    @property identificationAttributeName
    @type String
    @default 'email'
    @public
  */
  identificationAttributeName: 'email',

  /**
    Combines the user's token (see
    {{#crossLink "DeviseAuthenticator/tokenAttributeName:property"}}{{/crossLink}})
    and identification (see
    {{#crossLink "DeviseAuthenticator/identificationAttributeName:property"}}{{/crossLink}})
    in the `Authorization` header.

    @method authorize
    @param {Object} data The data that the session currently holds
    @param {Function} block The block to call with the authoriztion data if the session is authenticated and authorization data is actually present
    @public
  */
  authorize(data, block) {
    const { tokenAttributeName, identificationAttributeName } = this.getProperties('tokenAttributeName', 'identificationAttributeName');
    const userToken          = data[tokenAttributeName];
    const userIdentification = data[identificationAttributeName];
    if (!isEmpty(userToken) && !isEmpty(userIdentification)) {
      const authData = `${tokenAttributeName}="${userToken}", ${identificationAttributeName}="${userIdentification}"`;
      block('Authorization', `Token ${authData}`);
    }
  }
});
