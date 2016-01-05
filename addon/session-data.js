import Ember from 'ember';

export default Ember.Object.extend({
  setUnknownProperty(key, value) {
    this[key] = value;
    Ember.defineProperty(this, key, null, value);
    Ember.addObserver(this, key, null, (sender, key, value) => {
      console.log('changed', key, value);
    });
    this.notifyPropertyChange(key);
  }
});
