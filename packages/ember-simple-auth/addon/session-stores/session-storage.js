/* global sessionStorage */
import RSVP from 'rsvp';

import { bind } from '@ember/runloop';
import { getOwner } from '@ember/application';
import BaseStore from './base';
import objectsAreEqual from '../utils/objects-are-equal';
import isFastBoot from 'ember-simple-auth/utils/is-fastboot';

/**
  Session store that persists data in the browser's `sessionStorage`.

  __`sessionStorage` is not available in Safari when running in private mode.__

  __This session store does not work with FastBoot. In order to use Ember
  Simple Auth with FastBoot, configure the
  {{#crossLink "CookieStore"}}{{/crossLink}} as the application's session
  store.__

  @class SessionStorageStore
  @module ember-simple-auth/session-stores/session-storage
  @extends BaseStore
  @public
*/
export default BaseStore.extend({
  /**
    The `sessionStorage` key the store persists data in.

    @property key
    @type String
    @default 'ember_simple_auth-session'
    @public
  */
  key: 'ember_simple_auth-session',

  init() {
    this._super(...arguments);

    this._isFastBoot = this.hasOwnProperty('_isFastBoot') ? this._isFastBoot : isFastBoot(getOwner(this));
    if (!this.get('_isFastBoot')) {
      window.addEventListener('storage', bind(this, this._handleStorageEvent));
    }
  },

  willDestroy() {
    if (!this.get('_isFastBoot')) {
      window.removeEventListener('storage', bind(this, this._handleStorageEvent));
    }
  },

  /**
    Persists the `data` in the `sessionStorage`.

    @method persist
    @param {Object} data The data to persist
    @return {Ember.RSVP.Promise} A promise that resolves when the data has successfully been persisted and rejects otherwise.
    @public
  */
  persist(data) {
    this._lastData = data;
    data = JSON.stringify(data || {});
    sessionStorage.setItem(this.key, data);

    return RSVP.resolve();
  },

  /**
    Returns all data currently stored in the `sessionStorage` as a plain object.

    @method restore
    @return {Ember.RSVP.Promise} A promise that resolves with the data currently persisted in the store when the data has been restored successfully and rejects otherwise.
    @public
  */
  restore() {
    let data = sessionStorage.getItem(this.key);

    return RSVP.resolve(JSON.parse(data) || {});
  },

  /**
    Clears the store by deleting the
    {{#crossLink "sessionStorageStore/key:property"}}{{/crossLink}} from
    `sessionStorage`.

    @method clear
    @return {Ember.RSVP.Promise} A promise that resolves when the store has been cleared successfully and rejects otherwise.
    @public
  */
  clear() {
    sessionStorage.removeItem(this.key);
    this._lastData = {};

    return RSVP.resolve();
  },

  _handleStorageEvent(e) {
    if (e.key === this.get('key')) {
      this.restore().then((data) => {
        if (!objectsAreEqual(data, this._lastData)) {
          this._lastData = data;
          this.trigger('sessionDataUpdated', data);
        }
      });
    }
  }
});
