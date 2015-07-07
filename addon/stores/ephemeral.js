import Base from './base';

/**
  Store that saves its data in memory and thus __is not actually persistent__.
  It does also not synchronize the session's state across multiple tabs or
  windows as those cannot share memory.

  __This store is mainly useful for testing.__

  _The factory for this store is registered as
  `'session-store:ephemeral'` in Ember's container._

  @class Ephemeral
  @namespace Stores
  @module stores/ephemeral
  @extends Stores.Base
  @public
*/
export default Base.extend({
  /**
    @method init
    @private
  */
  init() {
    this.clear();
  },

  /**
    Persists the `data`.

    @method persist
    @param {Object} data The data to persist
    @public
  */
  persist(data) {
    this._data = JSON.stringify(data || {});
  },

  /**
    Restores all data currently saved as a plain object.

    @method restore
    @return {Object} All data currently persisted
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
