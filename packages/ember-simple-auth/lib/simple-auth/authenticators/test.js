import Base from './base';

/**
  Authenticator that is used by the test helpers. This authenticator simply
  always returns a resolving promise.

  _The factory for this authenticator is registered as
  `'simple-auth-authenticator:test'` in Ember's container when `Ember.testing`
  is `true`._

  @class Test
  @namespace SimpleAuth.Authenticators
  @module simple-auth/authenticators/base
  @extends Base
  @uses Ember.Evented
*/
export default Base.extend({
  /**
    Restores the session from a set of session properties; __will always return
    a resolving promise__.

    @method restore
    @param {Object} data The data to restore the session from
    @return {Ember.RSVP.Promise} A resolving promise
  */
  restore: function(data) {
    return new Ember.RSVP.resolve();
  },

  /**
    Authenticates the session; __will always return a resolving promise__.

    @method authenticate
    @param {Object} options The options to authenticate the session with
    @return {Ember.RSVP.Promise} A resolving promise
  */
  authenticate: function(options) {
    return new Ember.RSVP.resolve();
  },

  /**
    Invalidates the session; __will always return a resolving promise__.

    @method invalidate
    @param {Object} data The data that the session currently holds
    @return {Ember.RSVP.Promise} A resolving promise
  */
  invalidate: function(data) {
    return new Ember.RSVP.resolve();
  }
});
