import Ember from 'ember';

export default function(defaults, callback) {
  return function(container, config) {
    var wrappedConfig = Ember.Object.create(config);
    for (var property in this) {
      if (this.hasOwnProperty(property) && Ember.typeOf(this[property]) !== 'function') {
        this[property] = wrappedConfig.getWithDefault(property, defaults[property]);
      }
    }
    if (callback) {
      callback.apply(this, [container, config]);
    }
  };
}
