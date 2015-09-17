import Ember from 'ember';
import BaseAuthenticator from './base';

const { RSVP, isEmpty } = Ember;

/**
  Authenticator that wraps the
  [Torii library](https://github.com/Vestorly/torii).

  @class ToriiAuthenticator
  @module ember-simple-auth/authenticators/torii
  @extends BaseAuthenticator
  @public
*/
export default BaseAuthenticator.extend({
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
    this.assertToriiIsPresent();

    data = data || {};
    return new RSVP.Promise((resolve, reject) => {
      if (!isEmpty(data.provider)) {
        let { provider } = data;
        this.get('torii').fetch(data.provider, data).then((data) => {
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
    this.assertToriiIsPresent();

    return new RSVP.Promise((resolve, reject) => {
      this.get('torii').open(provider, options || {}).then((data) => {
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
      this.get('torii').close(this.provider).then(() => {
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
  },

  /**
    @method assertToriiIsPresent
    @private
  */
  assertToriiIsPresent() {
    const torii = this.get('torii');
    Ember.assert('You are trying to use `torii-authenticator` but torii is not installed. Install torii using `ember install torii`.', Ember.isPresent(torii));
  }
});
