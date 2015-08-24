import Ember from 'ember';
import Base from './base';
import Configuration from './../configuration';

/**
  Authenticator that works with the Ruby gem
  [Devise](https://github.com/plataformatec/devise).

  __As token authentication is not actually part of devise anymore, the server
  needs to implement some customizations__ to work with this authenticator -
  see the README and
  [discussion here](https://gist.github.com/josevalim/fb706b1e933ef01e4fb6).

  _The factory for this authenticator is registered as
  `'simple-auth-authenticator:devise'` in Ember's container._

  @class Devise
  @namespace Authenticators
  @module authenticators/devise
  @extends Base
  @public
*/
export default Base.extend({
  /**
    The endpoint on the server the authenticator acquires the auth token
    and email from.

    This value can be configured via
    [`SimpleAuth.Configuration.Devise#serverTokenEndpoint`](#SimpleAuth-Configuration-Devise-serverTokenEndpoint).

    @property serverTokenEndpoint
    @type String
    @default '/users/sign_in'
    @public
  */
  serverTokenEndpoint: '/users/sign_in',

  /**
    The devise resource name

    This value can be configured via
    [`SimpleAuth.Configuration.Devise#resourceName`](#SimpleAuth-Configuration-Devise-resourceName).

    @property resourceName
    @type String
    @default 'user'
    @public
  */
  resourceName: 'user',

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
    this.serverTokenEndpoint         = Configuration.devise.serverTokenEndpoint;
    this.resourceName                = Configuration.devise.resourceName;
    this.tokenAttributeName          = Configuration.devise.tokenAttributeName;
    this.identificationAttributeName = Configuration.devise.identificationAttributeName;
  },

  /**
    Restores the session from a set of session properties; __will return a
    resolving promise when there's a non-empty `token` and a non-empty
    `email` in the `properties`__ and a rejecting promise otherwise.

    @method restore
    @param {Object} properties The properties to restore the session from
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
    @public
  */
  restore(properties) {
    let propertiesObject = Ember.Object.create(properties);
    return new Ember.RSVP.Promise((resolve, reject) => {
      if (!Ember.isEmpty(propertiesObject.get(this.tokenAttributeName)) && !Ember.isEmpty(propertiesObject.get(this.identificationAttributeName))) {
        resolve(properties);
      } else {
        let resource = propertiesObject.get(this.resourceName);
        if (typeof resource === 'object') {
          propertiesObject = Ember.Object.create(resource);
        } else {
          propertiesObject = null;
        }
        if (propertiesObject && !Ember.isEmpty(propertiesObject.get(this.tokenAttributeName)) && !Ember.isEmpty(propertiesObject.get(this.identificationAttributeName))) {
          resolve(properties);
        } else {
          reject();
        }
      }
    });
  },

  /**
    Authenticates the session with the specified `credentials`; the credentials
    are `POST`ed to the
    [`Authenticators.Devise#serverTokenEndpoint`](#SimpleAuth-Authenticators-Devise-serverTokenEndpoint)
    and if they are valid the server returns an auth token and email in
    response. __If the credentials are valid and authentication succeeds, a
    promise that resolves with the server's response is returned__, otherwise a
    promise that rejects with the server error is returned.

    @method authenticate
    @param {Object} options The credentials to authenticate the session with
    @return {Ember.RSVP.Promise} A promise that resolves when an auth token and email is successfully acquired from the server and rejects otherwise
    @public
  */
  authenticate(credentials) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      let data                = {};
      data[this.resourceName] = {
        password: credentials.password
      };
      data[this.resourceName][this.identificationAttributeName] = credentials.identification;

      this.makeRequest(data).then(function(response) {
        Ember.run(function() {
          resolve(response);
        });
      }, function(xhr) {
        Ember.run(function() {
          reject(xhr.responseJSON || xhr.responseText);
        });
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
    return Ember.RSVP.resolve();
  },

  /**
    @method makeRequest
    @private
  */
  makeRequest(data) {
    return Ember.$.ajax({
      url:        this.serverTokenEndpoint,
      type:       'POST',
      dataType:   'json',
      data,
      beforeSend(xhr, settings) {
        xhr.setRequestHeader('Accept', settings.accepts.json);
      }
    });
  }
});
