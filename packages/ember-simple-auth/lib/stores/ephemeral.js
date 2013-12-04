'use strict';

Ember.SimpleAuth.Stores.Ephemeral = Ember.Object.extend(Ember.Evented, {
  restore: function() {
    return {};
  },

  load: function(property) {
    return undefined
  },

  save: function(properties) {
  }
});
