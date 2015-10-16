import Ember from 'ember';
import BaseAuthorizer from './base';

const { isEmpty } = Ember;

/**
  Authorizer that works with the Ruby gem
  [devise](https://github.com/plataformatec/devise); includes the user's token
  and identification from the session data in the `Authorization` HTTP header,
  e.g.:

  ```
  Authorization: token="234rtgjneroigne4" email="user@domain.tld"
  ```

  __As token authentication is not actually part of devise anymore, the server
  needs to implement some customizations__ to work with this authenticator -
  see [this gist](https://gist.github.com/josevalim/fb706b1e933ef01e4fb6).

  @class DeviseAuthorizer
  @module ember-simple-auth/authorizers/devise
  @extends BaseAuthorizer
  @public
*/
export default BaseAuthorizer.extend({
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
    Includes the user's token (see
    {{#crossLink "DeviseAuthenticator/tokenAttributeName:property"}}{{/crossLink}})
    and identification (see
    {{#crossLink "DeviseAuthenticator/identificationAttributeName:property"}}{{/crossLink}})
    in the `Authorization` header.

    @method authorize
    @param {Object} data The data that the session currently holds
    @param {Function} block(headerName,headerContent) The callback to call with the authorization data; will receive the header name and header content as arguments
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
