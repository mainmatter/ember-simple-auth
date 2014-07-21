import Base from 'simple-auth/authenticators/base';

/**
  Authenticator that wraps the
  [Torii library](https://github.com/Vestorly/torii).

  _The factory for this authenticator is registered as
  `'simple-auth-authenticator:torii'` in Ember's container._

  @class Torii
  @namespace SimpleAuth.Authenticators
  @module simple-auth-torii/authenticators/torii
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
    Restores the session by calling the torii provider's `fetch` method.

    @method restore
    @param {Object} data The data to restore the session from
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
  */
  restore: function(data) {
    var _this = this;
    data      = data || {};
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(data.provider)) {
        var provider = data.provider;
        _this.torii.fetch(data.provider, data).then(function(data) {
          _this.resolveWith(provider, data, resolve);
        }, function() {
          delete _this.provider;
          reject();
        });
      } else {
        delete _this.provider;
        reject();
      }
    });
  },

  /**
    Authenticates the session by opening the torii provider. For more
    documentation on torii, see the
    [project's README](https://github.com/Vestorly/torii#readme).

    @method authenticate
    @param {String} provider The provider to authenticate the session with
    @return {Ember.RSVP.Promise} A promise that resolves when the provider successfully authenticates a user and rejects otherwise
  */
  authenticate: function(provider) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      _this.torii.open(provider).then(function(data) {
        _this.resolveWith(provider, data, resolve);
      }, reject);
    });
  },

  /**
    Closes the torii provider.

    @method invalidate
    @param {Object} data The data that's stored in the session
    @return {Ember.RSVP.Promise} A promise that resolves when the provider successfully closes and rejects otherwise
  */
  invalidate: function(data) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      _this.torii.close(_this.provider).then(function() {
        delete _this.provider;
        resolve();
      }, reject);
    });
  },

  /**
    @method resolveWith
    @private
  */
  resolveWith: function(provider, data, resolve) {
    data.provider = provider;
    this.provider = data.provider;
    resolve(data);
  }

});
