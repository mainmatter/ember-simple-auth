import Base from 'simple-auth/authenticators/base';
import isSecureUrl from 'simple-auth/utils/is-secure-url';
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
  @namespace SimpleAuth.Authenticators
  @module simple-auth-devise/authenticators/devise
  @extends Base
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
  */
  serverTokenEndpoint: '/users/sign_in',

  /**
    The devise resource name

    This value can be configured via
    [`SimpleAuth.Configuration.Devise#resourceName`](#SimpleAuth-Configuration-Devise-resourceName).

    @property resourceName
    @type String
    @default 'user'
  */
  resourceName: 'user',

  /**
    The token attribute name

    This value can be configured via
    [`SimpleAuth.Configuration.Devise#tokenAttributeName`](#SimpleAuth-Configuration-Devise-tokenAttributeName).

    @property tokenAttributeName
    @type String
    @default 'user_token'
  */
  tokenAttributeName: 'user_token',

  /**
    The identification attribute name

    This value can be configured via
    [`SimpleAuth.Configuration.Devise#identificationAttributeName`](#SimpleAuth-Configuration-Devise-identificationAttributeName).

    @property identificationAttributeName
    @type String
    @default 'user_email'
  */
  identificationAttributeName: 'user_email',

  /**
    @method init
    @private
  */
  init: function() {
    this.serverTokenEndpoint          = Configuration.serverTokenEndpoint;
    this.resourceName                 = Configuration.resourceName;
    this.tokenAttributeName           = Configuration.tokenAttributeName;
    this.identificationAttributeName  = Configuration.identificationAttributeName;
  },

  /**
    Restores the session from a set of session properties; __will return a
    resolving promise when there's a non-empty `user_token` and a non-empty
    `user_email` in the `properties`__ and a rejecting promise otherwise.

    @method restore
    @param {Object} properties The properties to restore the session from
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
  */
  restore: function(properties) {
    var _properties = Ember.Object.create(properties);
    var _this = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(_properties.get(_this.tokenAttributeName) && !Ember.isEmpty(_properties.get(_this.identificationAttributeName)))) {
        resolve(properties);
      } else {
        reject();
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
  */
  authenticate: function(credentials) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var data                 = {};
      data[_this.resourceName] = {
        email:    credentials.identification,
        password: credentials.password
      };
      _this.makeRequest(data).then(function(response) {
        Ember.run(function() {
          resolve(response);
        });
      }, function(xhr, status, error) {
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
  */
  invalidate: function() {
    return Ember.RSVP.resolve();
  },

  /**
    @method makeRequest
    @private
  */
  makeRequest: function(data, resolve, reject) {
    if (!isSecureUrl(this.serverTokenEndpoint)) {
      Ember.Logger.warn('Credentials are transmitted via an insecure connection - use HTTPS to keep them secure.');
    }
    return Ember.$.ajax({
      url:        this.serverTokenEndpoint,
      type:       'POST',
      data:       data,
      dataType:   'json',
      beforeSend: function(xhr, settings) {
        xhr.setRequestHeader('Accept', settings.accepts.json);
      }
    });
  }
});
