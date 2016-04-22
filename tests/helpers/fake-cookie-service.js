import Ember from 'ember';

const { isNone } = Ember;

export default Ember.Object.extend({
  init() {
    this._super(...arguments);

    this._content = {};
  },

  read(name) {
    const value = this._content[name];

    if (isNone(value)) {
      return value;
    } else {
      return decodeURIComponent(value);
    }
  },

  write(name, value) {
    if (isNone(value)) {
      delete this._content[name];
    } else {
      this._content[name] = encodeURIComponent(value);
    }
  }
});
