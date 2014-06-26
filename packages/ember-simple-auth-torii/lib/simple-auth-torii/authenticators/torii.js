import Base from 'simple-auth/authenticators/base';

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
    @property torii
    @private
  */
  torii: null,

  /**
    @property provider
    @private
  */
  provider: null,

  /**
    @method restore
    @param {Object} data The data to restore the session from
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
  */
  restore: function(data) {
    return this.torii.fetch(this.provider);
  },

  /**
    @method authenticate
    @param {Object} options The options to authenticate the session with; this must be an object with a `torii` property containing the torii object and a `provider` property containg the provider to use
    @return {Ember.RSVP.Promise} A promise that resolves when an access token is successfully acquired from the server and rejects otherwise
  */
  authenticate: function(provider) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      _this.torii.open(provider).then(function(data) {
        _this.provider = provider;
        resolve(data);
      }, reject);
    });
  },

  /**
    Cancels any outstanding automatic token refreshes and returns a resolving
    promise.

    @method invalidate
    @return {Ember.RSVP.Promise} A resolving promise
  */
  invalidate: function() {
    return this.torii.close(this.provider);
  }

});
