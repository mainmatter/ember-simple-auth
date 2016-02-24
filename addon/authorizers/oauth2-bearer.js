/* jscs:disable requireDotNotation */
import Ember from 'ember';
import Base from './base';

const { isEmpty } = Ember;

/**
  Authorizer that conforms to OAuth 2
  ([RFC 6749](http://tools.ietf.org/html/rfc6749)); includes the access token
  from the session data as a bearer token
  ([RFC 6750](http://tools.ietf.org/html/rfc6750)) in the `Authorization`
  header, e.g.:

  ```
  Authorization: Bearer 234rtgjneroigne4
  ```

  @class OAuth2BearerAuthorizer
  @module ember-simple-auth/authorizers/oauth2-bearer
  @extends BaseAuthorizer
  @public
*/
export default Base.extend({
  /**
    Includes the access token from the session data into the `Authorization`
    header as a Bearer token, e.g.:

    ```
    Authorization: Bearer 234rtgjneroigne4
    ```

    @method authorize
    @param {Object} data The data that the session currently holds
    @return {Ember.RSVP.Promise} A promise that resolves after authrorization is complete with an object that has two keys: headerName and headerValue.
    @public
  */
  authorize(data, ...args) {
    const accessToken = data['access_token'];
    if (!isEmpty(accessToken)) {
      const headerName = 'Authorization';
      const headerValue = `Bearer ${accessToken}`;

      if (typeof args[0] === 'function') {
        Ember.deprecate(`Ember Simple Auth: Synchronous authorizers have been deprecated. You shouldn't pass callback function to authorizer.authorize anymore, it returns promise.`, false, {
          id: 'ember-simple-auth.OAuth2BearerAuthorizer.authorize',
          until: '2.0.0'
        });

        args[0](headerName, headerValue);
      } else {
        return Ember.RSVP.resolve({ headerName, headerValue });
      }
    }
  }
});
