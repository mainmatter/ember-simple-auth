import Ember from 'ember';
import BaseStore from './base';

const { on } = Ember;

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
  _setup: on('init', function() {
    this.clear();
  }),

  /**
    Persists the `data`. This replaces all currently stored data.

    @method persist
    @param {Object} data The data to persist
    @public
  */
  persist(data) {
    this._data = JSON.stringify(data || {});
  },

  /**
    Returns all data currently stored as a plain object.

    @method restore
    @return {Object} The data currently persisted in the store.
    @public
  */
  restore() {
    return JSON.parse(this._data) || {};
  },

  /**
    Clears the store.

    @method clear
    @public
  */
  clear() {
    delete this._data;
    this._data = '{}';
  }
});
