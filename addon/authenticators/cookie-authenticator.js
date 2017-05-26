import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';

const { RSVP, Logger } = Ember;

/**
  Authenticator that works with session cookies

  Authenticator is working on premise that cookie is received after authorization
  and cookie is attached to every request automatically by browser, so no other
  modifications are required.

  @class CookieAuthenticator
  @module ember-simple-auth/authenticators/cookie-authenticator
  @extends BaseAuthenticator
  @public
*/

export default Base.extend({
  /**
    The endpoint on the server that authentication request is sent to.

    @property serverLoginEndpoint
    @type String
    @default '/login'
    @public
  */
  serverLoginEndpoint: '/login',

  /**
    The endpoint on the server that invalidates authenticated session

    @property serverLogoutEndpoint
    @type String
    @default '/logout'
    @public
  */
  serverLogoutEndpoint: '/logout',

  /**
    The endpoint on the server that check if session is still authenticated

    @property serverStatusEndpoint
    @type String
    @default '/login-status'
    @public
  */
  serverStatusEndpoint: '/login-status',

  /**
    Authenticates session by sending login information (usually username and
    password) to the server.

    If credentials are valid and session is authenticated, server should return
    session cookie with success response code. We do not need to take care about
    names of the cookie because this part is handled by browser itself.

    @method authenticate
    @param {Array} data Login information send to the server
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming authenticated
    @public
  */
  authenticate: function(data) {
    return this.makeRequest(
      {type: 'POST', url: this.serverLoginEndpoint, data: data},
      'Attempt to login was successful',
      'Attempt to logout was not successful'
    );
  },

  /**
    Restoring a session is not an operation that requires any action because
    cookies are handled and shared between windows by browser. As an addon to
    ember-simple-auth, result that provides information if we are authenticated
    is required. It is possible to check whether cookie is available but it may
    be invalidated by server. In order to check the real state of our credentials,
    it is required to do a request to authenticated endpoint.

    @method restore
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming or remaining authenticated
    @public
  */
  restore: function() {
    return this.makeRequest(
      {type: 'GET', url: this.serverStatusEndpoint},
      'Attempt to check if session is authenticated was successful',
      'Attempt to check if session is authenticated was unsuccessful'
    );
  },

  /**
    Invalidate authenticated session by visiting logout endpoint.

    Cookies may be still stored in the browser but server did not accept
    them as valid anymore.

    @method invalidate
    @return A promise that when it resolves results in the session being invalidated
    @public
  */
  invalidate: function() {
    return this.makeRequest(
        {type: 'GET', url: this.serverLogoutEndpoint},
        'Attempt to logout session was successful',
        'Attempt to logout session was unsuccessful'
    );
  },

  /**
    Makes a request to authentication server

    @param {Object} data The request data
    @param {String} debug_msg_true Message displayed after successful AJAX call
    @param {String} debug_msg_false Message displayed after unsuccessful AJAX call
  */
  makeRequest: function(options, debug_msg_true, debug_msg_false) {
    return new RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax(options).then(
        function(response) {
          Ember.run(() => {
            Logger.debug(debug_msg_true + ' with response: ' + response);
            resolve(response);
          });
        },
        function(xhr) {
          Ember.run(() => {
            Logger.debug(debug_msg_false + ' with xhr: ' + xhr);
            reject(xhr);
          });
        }
      );
    });
  }
});
