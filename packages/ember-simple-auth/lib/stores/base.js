'use strict';

Ember.SimpleAuth.Stores.Base = Ember.Object.extend(Ember.Evented, {
  persist: function(properties) {
  },

  restore: function() {
    return {};
  },

  clear: function() {
  }
});
