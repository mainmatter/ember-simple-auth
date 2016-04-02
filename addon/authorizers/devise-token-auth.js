import Ember from 'ember';
import BaseAuthorizer from './base';

const { isEmpty, get } = Ember;

/**
  Authorizer that works with the Ruby gem
  [devise_token_auth](https://github.com/lynndylanhurley/devise_token_auth); includes the user's authorization
  header information, access-token, client, uid, token-type and expiry
  from the session data in the HTTP headers,
  e.g.:

  ```
  access-token: 3q8aQQvgHGSMnLVKwuKKJg
  client: JMmX-w6PtSReFKZ6PsD6wA
  uid: me@jaiivarsson.com
  expiry: 1460798714
  token-type: Bearer
  ```

  @class DeviseTokenAuthAuthorizer
  @module ember-simple-auth/authorizers/devise
  @extends BaseAuthorizer
  @public
*/
export default BaseAuthorizer.extend({
  /**
    The token attribute name. __This will be used in the request and also be
    expected in the server's response.__

    @property tokenAttributeName
    @type String
    @default 'token'
    @public
  */
  tokenHeaderAttributeName: 'access-token',

  /**
    The token attribute name. __This will be used in the request and also be
    expected in the server's response.__

    @property tokenAttributeName
    @type String
    @default 'token'
    @public
  */
  clientHeaderAttributeName: 'client',

  /**
    The token attribute name. __This will be used in the request and also be
    expected in the server's response.__

    @property tokenAttributeName
    @type String
    @default 'token'
    @public
  */
  expiryHeaderAttributeName: 'expiry',

  /**
    The token attribute name. __This will be used in the request and also be
    expected in the server's response.__

    @property tokenAttributeName
    @type String
    @default 'token'
    @public
  */
  uidHeaderAttributeName: 'uid',

  /**
    The token attribute name. __This will be used in the request and also be
    expected in the server's response.__

    @property tokenAttributeName
    @type String
    @default 'token'
    @public
  */
  tokenHeaderTypeAttributeName: 'token-type',

  /**
    The identification attribute name.

    @property identificationAttributeName
    @type String
    @default 'email'
    @public
  */
  identificationAttributeName: 'email',

  /**
    Includes the appropriate headers (see
    {{#crossLink "DeviseTokenAuthAuthenticator/tokenHeaderAttributeName:property"}}access-token{{/crossLink}},
    {{#crossLink "DeviseTokenAuthAuthenticator/clientHeaderAttributeName:property"}}client{{/crossLink}},
    {{#crossLink "DeviseTokenAuthAuthenticator/expiryHeaderAttributeName:property"}}expiry{{/crossLink}},
    {{#crossLink "DeviseTokenAuthAuthenticator/uidHeaderAttributeName:property"}}uid{{/crossLink}},
    and
    {{#crossLink "DeviseTokenAuthAuthenticator/tokenHeaderTypeAttributeName:property"}}token-type{{/crossLink}}).

    @method authorize
    @param {Object} data The data that the session currently holds
    @param {Function} block(headerName,headerContent) The callback to call with the authorization data; will receive the header name and header content as arguments
    @public
  */
  authorize(data, block) {
    const { tokenHeaderAttributeName,
            clientHeaderAttributeName,
            expiryHeaderAttributeName,
            uidHeaderAttributeName,
            tokenHeaderTypeAttributeName } = this.getProperties('tokenHeaderAttributeName',
                                                                'clientHeaderAttributeName',
                                                                'expiryHeaderAttributeName',
                                                                'uidHeaderAttributeName',
                                                                'tokenHeaderTypeAttributeName');
    const tokenHeaderAttribute = get(data, tokenHeaderAttributeName);
    const clientHeaderAttribute = get(data, clientHeaderAttributeName);
    const expiryHeaderAttribute = get(data, expiryHeaderAttributeName);
    const uidHeaderAttribute = get(data, uidHeaderAttributeName);
    const tokenHeaderTypeAttribute = get(data, tokenHeaderTypeAttributeName);

    if (!isEmpty(tokenHeaderAttribute)
        && !isEmpty(clientHeaderAttribute)
        && !isEmpty(expiryHeaderAttribute)
        && !isEmpty(uidHeaderAttribute)
        && !isEmpty(tokenHeaderTypeAttribute)
        && parseInt(expiryHeaderAttribute) > Date.now()/1000) {
      block(tokenHeaderAttributeName, tokenHeaderAttribute);
      block(clientHeaderAttributeName, clientHeaderAttribute);
      block(expiryHeaderAttributeName, expiryHeaderAttribute);
      block(uidHeaderAttributeName, uidHeaderAttribute);
      block(tokenHeaderTypeAttributeName, tokenHeaderTypeAttribute);
    }
  }
});
