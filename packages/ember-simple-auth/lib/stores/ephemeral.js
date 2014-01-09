'use strict';

Ember.SimpleAuth.Stores.Ephemeral = Ember.SimpleAuth.Stores.Base.extend({
  init: function() {
    this.clear();
  },

  persist: function(properties) {
    this._data = Ember.$.extend(properties, this._data);
  },

  restore: function() {
    return Ember.$.extend({}, this._data);
  },

  clear: function() {
    delete this._data;
    this._data = {};
  }
});
