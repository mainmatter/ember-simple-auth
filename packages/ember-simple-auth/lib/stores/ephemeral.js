'use strict';

Ember.SimpleAuth.Stores.Ephemeral = Ember.Object.extend(Ember.Evented, {
  init: function() {
    this.clear();
  },

  restore: function() {
    return Ember.$.extend({}, this._data);
  },

  clear: function() {
    delete this._data;
    this._data = {};
  },

  persist: function(properties) {
    for (var property in properties) {
      var value = properties[property];
      if (!Ember.isEmpty(value)) {
        this._data[property] = value;
      } else {
        delete this._data[property];
      }
    }
  }
});
