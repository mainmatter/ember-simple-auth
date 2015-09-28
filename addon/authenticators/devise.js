import Ember from 'ember';
import BaseAuthenticator from './base';

const { RSVP, isEmpty, run, get } = Ember;

/**
  Authenticator that works with the Ruby gem
  [Devise](https://github.com/plataformatec/devise).

  __As token authentication is not actually part of devise anymore, the server
  needs to implement some customizations__ to work with this authenticator -
  see the README and
  [discussion here](https://gist.github.com/josevalim/fb706b1e933ef01e4fb6).

  @class DeviseAuthenticator
  @module ember-simple-auth/authenticators/devise
  @extends BaseAuthenticator
  @public
*/
export default BaseAuthenticator.extend({
  /**
    The endpoint on the server the authenticator acquires the token and user
    identification from.

    @property serverTokenEndpoint
    @type String
    @default '/users/sign_in'
    @public
  */
  serverTokenEndpoint: '/users/sign_in',

  /**
    The devise resource name.

    @property resourceName
    @type String
    @default 'user'
    @public
  */
  resourceName: 'user',

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
    Restores the session from a session data object; __will return a
    resolving promise when there are non-empty
    {{#crossLink "DeviseAuthenticator/tokenAttributeName:property"}}token{{/crossLink}}
    non-empty
    {{#crossLink "DeviseAuthenticator/identificationAttributeName:property"}}identification{{/crossLink}}
    values in `data`__ and a rejecting promise otherwise.

    @method restore
    @param {Object} data The data to restore the session from
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming or remaining authenticated
    @public
  */
  restore(data) {
    const { tokenAttributeName, identificationAttributeName } = this.getProperties('tokenAttributeName', 'identificationAttributeName');
    const tokenAttribute = get(data, tokenAttributeName);
    const identificationAttribute = get(data, identificationAttributeName);
    return new RSVP.Promise((resolve, reject) => {
      if (!isEmpty(tokenAttribute) && !isEmpty(identificationAttribute)) {
        resolve(data);
      } else {
        reject();
      }
    });
  },

  /**
    Authenticates the session with the specified `credentials`; the credentials
    are `POST`ed to the
    {{#crossLink "DeviseAuthenticator/serverTokenEndpoint:property"}}server{{/crossLink}}.
    If the credentials are valid the server will return a
    {{#crossLink "DeviseAuthenticator/tokenAttributeName:property"}}token{{/crossLink}}
    and
    {{#crossLink "DeviseAuthenticator/identificationAttributeName:property"}}identification{{/crossLink}}
    in response. __If the credentials are valid and authentication succeeds, a
    promise that resolves with the server's response is returned__, otherwise a
    promise that rejects with the server error is returned.

    @method authenticate
    @param {Object} options The credentials to authenticate the session with
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming authenticated
    @public
  */
  authenticate(credentials) {
    return new RSVP.Promise((resolve, reject) => {
      const { resourceName, identificationAttributeName } = this.getProperties('resourceName', 'identificationAttributeName');
      const data         = {};
      data[resourceName] = {
        password: credentials.password
      };
      data[resourceName][identificationAttributeName] = credentials.identification;

      this._makeRequest(data).then(function(response) {
        run(null, resolve, response);
      }, function(xhr) {
        run(null, reject, xhr.responseJSON || xhr.responseText);
      });
    });
  },

  /**
    Does nothing

    @method invalidate
    @return {Ember.RSVP.Promise} A resolving promise
    @public
  */
  invalidate() {
    return RSVP.resolve();
  },

  _makeRequest(data) {
    const serverTokenEndpoint = this.get('serverTokenEndpoint');
    return Ember.$.ajax({
      url:      serverTokenEndpoint,
      type:     'POST',
      dataType: 'json',
      data,
      beforeSend(xhr, settings) {
        xhr.setRequestHeader('Accept', settings.accepts.json);
      }
    });
  }
});
