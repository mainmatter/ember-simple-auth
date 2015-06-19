export default function(defaults) {
  return function(config) {
    var wrappedConfig = Ember.Object.create(config);
    for (var property in this) {
      if (this.hasOwnProperty(property) && Ember.typeOf(this[property]) !== 'function') {
        this[property] = wrappedConfig.getWithDefault(property, defaults[property]);
      }
    }
  };
}
