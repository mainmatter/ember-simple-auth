'use strict';

Ember.SimpleAuth.Stores.Ephemeral = Ember.Object.extend(Ember.Evented, {
  init: function() {
    this._data = {};
  },

  restore: function() {
    var properties = jQuery.extend({}, this._data);
    return Ember.RSVP.resolve(properties);
  },

  load: function(property) {
    return Ember.RSVP.resolve(this._data[property]);
  },

  save: function(properties) {
    for (var property in properties) {
      var value = properties[property];
      if (!Ember.isEmpty(value)) {
        this._data[property] = value;
      } else {
        delete this._data[property];
      }
    }
    return Ember.RSVP.resolve();
  }
});
