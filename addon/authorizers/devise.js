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
    @return {Ember.RSVP.Promise} A promise that resolves after authrorization is complete with an object that has two keys: headerName and headerValue.
    @public
  */
  authorize(data, ...args) {
    const { tokenAttributeName, identificationAttributeName } = this.getProperties('tokenAttributeName', 'identificationAttributeName');
    const userToken          = data[tokenAttributeName];
    const userIdentification = data[identificationAttributeName];
    if (!isEmpty(userToken) && !isEmpty(userIdentification)) {
      const authData = `${tokenAttributeName}="${userToken}", ${identificationAttributeName}="${userIdentification}"`;
      const headerName = 'Authorization';
      const headerValue = `Token ${authData}`;

      if (typeof args[0] === 'function') {
        Ember.deprecate(`Ember Simple Auth: Synchronous authorizers have been deprecated. You shouldn't pass callback function to authorizer.authorize anymore, it returns promise.`, false, {
          id: 'ember-simple-auth.DeviseAuthorizer.authorize',
          until: '2.0.0'
        });

        args[0](headerName, headerValue);
      } else {
        return Ember.RSVP.resolve({ headerName, headerValue });
      }
    }
  }
});
