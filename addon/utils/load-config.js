import Ember from 'ember';

export default function(defaults) {
  return function(config) {
    let wrappedConfig = Ember.Object.create(config);
    for (let property in this) {
      if (this.hasOwnProperty(property) && Ember.typeOf(this[property]) !== 'function') {
        this[property] = wrappedConfig.getWithDefault(property, defaults[property]);
      }
    }
  };
}
