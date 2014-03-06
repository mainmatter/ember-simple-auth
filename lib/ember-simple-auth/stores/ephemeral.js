var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import { Base } from './base';

/**
  Store that saves its data in memory and thus __is not actually persistent__.

  @class Ephemeral
  @namespace EmberSimpleAuth.Stores
  @extends EmberSimpleAuth.Stores.Base
*/
var Ephemeral = Base.extend({
  /**
    @method init
    @private
  */
  init: function() {
    this.clear();
  },

  /**
    Persists the `data`.

    @method persist
    @param {Object} data The data to persist
  */
  persist: function(data) {
    this._data = Ember.$.extend(data, this._data);
  },

  /**
    Restores all data currently saved as one object.

    @method restore
    @return {Object} All data currently persisted
  */
  restore: function() {
    return Ember.$.extend({}, this._data);
  },

  /**
    Clears the store.

    @method clear
  */
  clear: function() {
    delete this._data;
    this._data = {};
  }
});

export { Ephemeral };
