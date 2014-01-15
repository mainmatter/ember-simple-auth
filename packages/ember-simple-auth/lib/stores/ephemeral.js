'use strict';

/**
  Store that saves its data in memory and thus __is not actually persistent__.

  @class Ephemeral
  @namespace Ember.SimpleAuth.Stores
  @extends Ember.SimpleAuth.Stores.Base
*/
Ember.SimpleAuth.Stores.Ephemeral = Ember.SimpleAuth.Stores.Base.extend({
  /**
    @method init
    @private
  */
  init: function() {
    this.clear();
  },

  /**
    Persists the `properties`.

    @method persist
    @param {Object} properties The properties to persist
  */
  persist: function(properties) {
    this._data = Ember.$.extend(properties, this._data);
  },

  /**
    Restores all properties currently saved.

    @method restore
    @return {Object} All properties currently persisted
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
