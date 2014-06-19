import Base from 'ember-simple-auth/authenticators/base';

var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

/**
  Authenticator that uses the awesome Torii library.

  @class Torii
  @namespace Authenticators
  @extends Base
*/
export default Base.extend({
  /**
    @method restore
    @param {Object} data The data to restore the session from
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
  */
  restore: function(data) {
    return this.torii.fetch();
  },

  /**
    @method authenticate
    @param {Object} credentials The credentials to authenticate the session with
    @return {Ember.RSVP.Promise} A promise that resolves when an access token is successfully acquired from the server and rejects otherwise
  */
  authenticate: function(provider) {
    return this.torii.open(provider);
  },

  /**
    Cancels any outstanding automatic token refreshes and returns a resolving
    promise.

    @method invalidate
    @return {Ember.RSVP.Promise} A resolving promise
  */
  invalidate: function() {
    return this.torii.close();
  }

});
