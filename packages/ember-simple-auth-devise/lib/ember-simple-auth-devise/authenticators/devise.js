var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

/**
  Authenticator for use with Devise.

  This authenticator supports Devise's rememberable module.

  @class Devise
  @namespace Authenticators
  @extends Base
*/
var Devise = Ember.SimpleAuth.Authenticators.Base.extend({
  /**
    The endpoint on the server the authenticator acquires the auth token
    from.

    @property serverTokenEndpoint
    @type String
    @default '/users/sign_in'
  */
  serverTokenEndpoint: '/users/sign_in',

  /**
    Restores the session from a set of session properties; __will return a
    resolving promise when there's a non-empty `auth_token` in the
    `properties`__ and a rejecting promise otherwise.

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
    returns an auth token in response . __If the credentials are
    valid and authentication succeeds, a promise that resolves with the
    server's response is returned__, otherwise a promise that rejects with the
    error is returned.

    @method authenticate
    @param {Object} options The credentials to authenticate the session with
    @return {Ember.RSVP.Promise} A promise that resolves when an auth token is successfully acquired from the server and rejects otherwise
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
          reject(xhr.responseText);
        });
      });
    });
  },

  /**
    Cancels any outstanding automatic token refreshes.

    @method invalidate
    @return {Ember.RSVP.Promise} A resolving promise
  */
  invalidate: function() {
    Ember.run.cancel(this._refreshTokenTimeout);
    delete this._refreshTokenTimeout;
    return Ember.RSVP.resolve();
  },

  /**
    Sends an `AJAX` request to the `serverTokenEndpoint`. This will always be a
    _"POST_" request with content type _"application/x-www-form-urlencoded".

    This method is not meant to be used directly but serves as an extension
    point to e.g. add _"Client Credentials".

    @method makeRequest
    @param {Object} data The data to send with the request, e.g. email and password or the auth_token
    @return {Ember.RSVP.Promise} A promise that resolves when a auth_token is successfully acquired from the server and rejects otherwise
    @protected
  */
  makeRequest: function(data, resolve, reject) {
    return Ember.$.ajax({
      url: this.serverTokenEndpoint,
      type: "POST",
      data: data,
      dataType: "json",
      contentType: "application/x-www-form-urlencoded"
    });
  }
});

export { Devise };
