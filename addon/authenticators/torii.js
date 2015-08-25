import Ember from 'ember';
import Base from './base';

const { RSVP, isEmpty } = Ember;

/**
  Authenticator that wraps the
  [Torii library](https://github.com/Vestorly/torii).

  _The factory for this authenticator is registered as
  `'simple-auth-authenticator:torii'` in Ember's container._

  @class Torii
  @namespace Authenticators
  @module authenticators/torii
  @extends Base
  @public
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
    @public
  */
  restore(data) {
    data = data || {};
    return new RSVP.Promise((resolve, reject) => {
      if (!isEmpty(data.provider)) {
        let { provider } = data;
        this.torii.fetch(data.provider, data).then((data) => {
          this.resolveWith(provider, data, resolve);
        }, () => {
          delete this.provider;
          reject();
        });
      } else {
        delete this.provider;
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
    @param {Object} options The options to pass to the torii provider
    @return {Ember.RSVP.Promise} A promise that resolves when the provider successfully authenticates a user and rejects otherwise
    @public
  */
  authenticate(provider, options) {
    return new RSVP.Promise((resolve, reject) => {
      this.torii.open(provider, options || {}).then((data) => {
        this.resolveWith(provider, data, resolve);
      }, reject);
    });
  },

  /**
    Closes the torii provider.

    @method invalidate
    @param {Object} data The data that's stored in the session
    @return {Ember.RSVP.Promise} A promise that resolves when the provider successfully closes and rejects otherwise
    @public
  */
  invalidate() {
    return new RSVP.Promise((resolve, reject) => {
      this.torii.close(this.provider).then(() => {
        delete this.provider;
        resolve();
      }, reject);
    });
  },

  /**
    @method resolveWith
    @private
  */
  resolveWith(provider, data, resolve) {
    data.provider = provider;
    this.provider = data.provider;
    resolve(data);
  }
});
