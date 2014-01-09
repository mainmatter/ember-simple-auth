'use strict';

/**
  This base authenticator strategy serves as a starting point for implementing custom authenticators.

  @class Base
  @namespace Ember.SimpleAuth.Authenticators
  @extends Ember.Object
  @uses Ember.Evented
  @constructor
*/
Ember.SimpleAuth.Authenticators.Base = Ember.Object.extend(Ember.Evented, {
  /**
    The restore method is invoked by the session when the Ember.js app is loaded and the session properties
    where (potentially) restored from the store (in the case when the user logs in and reloads tha page). This method
    returns a promise. When this promise resolves the session will regard itself as being authenticated with the
    properties the promise resolves with. When the promise rejects the session will remain unauthenticated.

    `Ember.SimpleAuth.Authenticators.Base`'s implementation checks whether there's a non-empty `authToken` in the
    properties and if there is resolves, otherwise rejects.

    @method restore
    @param {Object} properties The properties to restore the session from
    @return {Ember.RSVP.Promise} A promise that resolves when the session should be authenticated
  */
  restore: function(properties) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(properties.authToken)) {
        resolve(properties);
      } else {
        reject();
      }
    });
  },

  /**
    This method authenticates the session with the specified `options`. These options might vary depending on the actual
    method of authentication the authenticator uses. This method returns a promise. When this promise resolves the session will regard itself as being authenticated with the
    properties the promise resolves with. When the promise rejects the session will remain unauthenticated.

    `Ember.SimpleAuth.Authenticators.Base`'s implementation always returns a rejecting promise.

    @method authenticate
    @param {Object} options The options to authenticate the session with
    @return {Ember.RSVP.Promise} A promise that resolves when the session should be authenticated
  */
  authenticate: function(options) {
    return new Ember.RSVP.Promise(function(resolve, reject) { reject(); });
  },

  /**
    This method invalidates the session. This is used as an entry point for authenticators that e.g. need to invalidate
    the auth token on the server side by e.g. issuing a `DELETE` request or so. This method returns a promise. When this promise resolves the session will regard itself as being invalidate and not authenticated anymore. When the promise rejects the session will remain authenticated.

    `Ember.SimpleAuth.Authenticators.Base`'s implementation always returns a resolving promise and thus always invalidates the session without doing anything.

    @method invalidate
    @return {Ember.RSVP.Promise} A promise that resolves when the session should be invalidate
  */
  invalidate: function() {
    return new Ember.RSVP.Promise(function(resolve) { resolve(); });
  }
});
