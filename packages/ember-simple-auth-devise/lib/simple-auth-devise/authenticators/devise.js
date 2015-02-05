import Base from 'simple-auth/authenticators/base';
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
    The token attribute name.

    This value can be configured via
    [`SimpleAuth.Configuration.Devise#tokenAttributeName`](#SimpleAuth-Configuration-Devise-tokenAttributeName).

    @property tokenAttributeName
    @type String
    @default 'token'
  */
  tokenAttributeName: 'token',

  /**
    The identification attribute name.

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
    resolving promise when there's a non-empty `token` and a non-empty
    `user_email` in the `data`__ (or whatever has been configured for
    [`SimpleAuth.Configuration.Devise#tokenAttributeName`](#SimpleAuth-Configuration-Devise-tokenAttributeName)
    and
    [`SimpleAuth.Configuration.Devise#identificationAttributeName`](#SimpleAuth-Configuration-Devise-identificationAttributeName))
    and a rejecting promise otherwise.

    @method restore
    @param {Object} data The current session data
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
  */
  restore: function(data) {
    var _this      = this;
    var dataObject = Ember.Object.create(data);
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(dataObject.get(_this.tokenAttributeName)) && !Ember.isEmpty(dataObject.get(_this.identificationAttributeName))) {
        resolve(data);
      } else {
        reject(_this.stripAuthenticatedData(data));
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
        password: credentials.password
      };
      data[_this.resourceName][_this.identificationAttributeName] = credentials.identification;

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
    Deletes the `token` and `user_email` properties from the session and
    returns a resolving promise.

    @method invalidate
    @param {Object} data The data of the session to be invalidated
    @return {Ember.RSVP.Promise} A resolving promise
  */
  invalidate: function(data) {
    return Ember.RSVP.resolve(this.stripAuthenticatedData(data || {}));
  },

  /**
    @method stripAuthenticatedData
    @private
  */
  stripAuthenticatedData: function(data) {
    Ember.A([this.tokenAttributeName, this.identificationAttributeName]).forEach(function(propertyName) {
      var rootProperty = propertyName.split('.')[0];
      delete data[rootProperty];
    });
    return data;
  },

  /**
    @method makeRequest
    @private
  */
  makeRequest: function(data, resolve, reject) {
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
