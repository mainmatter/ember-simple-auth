import Ember from 'ember';
import BaseStore from './base';

const { RSVP } = Ember;

/**
  Session store that __persists data in memory and thus is not actually
  persistent__. It does also not synchronize the session's state across
  multiple tabs or windows as those cannot share memory. __This store is mainly
  useful for testing and will automatically be used when running tests.__

  @class EphemeralStore
  @module ember-simple-auth/session-stores/ephemeral
  @extends BaseStore
  @public
*/
export default BaseStore.extend({
  init() {
    this._super(...arguments);
    this.clear();
  },

  /**
    Persists the `data`. This replaces all currently stored data.

    @method persist
    @param {Object} data The data to persist
    @return {Ember.RSVP.Promise} A promise that resolves when the data has successfully been persisted and rejects otherwise.
    @public
  */
  persist(data) {
    this._data = JSON.stringify(data || {});

    return RSVP.resolve();
  },

  /**
    Returns all data currently stored as a plain object.

    @method restore
    @return {Ember.RSVP.Promise} A promise that resolves with the data currently persisted in the store when the data has been restored successfully and rejects otherwise.
    @public
  */
  restore() {
    const data = JSON.parse(this._data) || {};

    return RSVP.resolve(data);
  },

  /**
    Clears the store.

    @method clear
    @return {Ember.RSVP.Promise} A promise that resolves when the store has been cleared successfully and rejects otherwise.
    @public
  */
  clear() {
    delete this._data;
    this._data = '{}';

    return RSVP.resolve();
  }
});
