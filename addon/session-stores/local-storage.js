/* global localStorage */
import Ember from 'ember';
import BaseStore from './base';
import objectsAreEqual from '../utils/objects-are-equal';

const { RSVP } = Ember;

/**
  Session store that persists data in the browser's `localStorage`.

  __`localStorage` is not available in Safari when running in private mode. In
  general it is better to use the
  {{#crossLink "AdaptiveStore"}}{{/crossLink}} that automatically falls back to
  the {{#crossLink "CookieStore"}}{{/crossLink}} when `localStorage` is not
  available.__

  @class LocalStorageStore
  @module ember-simple-auth/session-stores/local-storage
  @extends BaseStore
  @public
*/
export default BaseStore.extend({
  /**
    The `localStorage` key the store persists data in.

    @property key
    @type String
    @default 'ember_simple_auth:session'
    @public
  */
  key: 'ember_simple_auth:session',

  init() {
    this._super(...arguments);

    this._bindToStorageEvents();
  },

  /**
    Persists the `data` in the `localStorage`.

    @method persist
    @param {Object} data The data to persist
    @return {Ember.RSVP.Promise} A promise that resolves when the data has successfully been persisted and rejects otherwise.
    @public
  */
  persist(data) {
    this._lastData = data;
    data = JSON.stringify(data || {});
    localStorage.setItem(this.key, data);

    return RSVP.resolve();
  },

  /**
    Returns all data currently stored in the `localStorage` as a plain object.

    @method restore
    @return {Ember.RSVP.Promise} A promise that resolves with the data currently persisted in the store when the data has been restored successfully and rejects otherwise.
    @public
  */
  restore() {
    let data = localStorage.getItem(this.key);

    return RSVP.resolve(JSON.parse(data) || {});
  },

  /**
    Clears the store by deleting the
    {{#crossLink "LocalStorageStore/key:property"}}{{/crossLink}} from
    `localStorage`.

    @method clear
    @return {Ember.RSVP.Promise} A promise that resolves when the store has been cleared successfully and rejects otherwise.
    @public
  */
  clear() {
    localStorage.removeItem(this.key);
    this._lastData = {};

    return RSVP.resolve();
  },

  _bindToStorageEvents() {
    Ember.$(window).bind('storage', (e) => {
      if (e.originalEvent.key === this.key) {
        this.restore().then((data) => {
          if (!objectsAreEqual(data, this._lastData)) {
            this._lastData = data;
            this.trigger('sessionDataUpdated', data);
          }
        });
      }
    });
  }
});
