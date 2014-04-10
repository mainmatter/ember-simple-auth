var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

/**
  Authenticator that works with the Ruby gem
  [Devise](https://github.com/plataformatec/devise).

  As token authentication is not actually part of devise anymore, the server
  needs to implement some customizations to work with this authenticator - see
  the README and
  [discussion here](https://gist.github.com/josevalim/fb706b1e933ef01e4fb6).

  _The factory for this authenticator is registered as `'authenticator:devise'`
  in Ember's container._

  @class Devise
  @namespace Authenticators
  @extends Base
*/
var Devise = Ember.SimpleAuth.Authenticators.Base.extend({
  /**
    The endpoint on the server the authenticator acquires the auth token
    and email from.

    @property serverTokenEndpoint
    @type String
    @default '/users/sign_in'
  */
  serverTokenEndpoint: '/users/sign_in',

  /**
    Restores the session from a set of session properties; __will return a
    resolving promise when there's a non-empty `auth_token` and a non-empty
    `auth_email` in the `properties`__ and a rejecting promise otherwise.

    @method restore
    @param {Object} properties The properties to restore the session from
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
  */
  restore: function(properties) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(properties.auth_token) && !Ember.isEmpty(properties.auth_email)) {
        resolve(properties);
      } else {
        reject();
      }
    });
  },

  /**
    Authenticates the session with the specified `credentials`; the credentials
    are `POST`ed to the `serverTokenEndpoint` and if they are valid the server
    returns an auth token and email in response . __If the credentials are
    valid and authentication succeeds, a promise that resolves with the
    server's response is returned__, otherwise a promise that rejects with the
    error is returned.

    @method authenticate
    @param {Object} options The credentials to authenticate the session with
    @return {Ember.RSVP.Promise} A promise that resolves when an auth token and email is successfully acquired from the server and rejects otherwise
  */
  authenticate: function(credentials) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var data = {
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
    if (!Ember.SimpleAuth.Utils.isSecureUrl(this.serverTokenEndpoint)) {
      Ember.Logger.warn('Credentials are transmitted via an insecure connection - use HTTPS to keep them secure.');
    }
    return Ember.$.ajax({
      url:         this.serverTokenEndpoint,
      type:        'POST',
      data:        data,
      dataType:    'json',
      contentType: 'application/x-www-form-urlencoded'
    });
  }
});

export { Devise };
