import Ember from 'ember';

const { Object: EmberObject, isNone } = Ember;

export default EmberObject.extend({
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
  },

  clear(name) {
    let expires     = new Date(0);
    this.write(name, null, { expires });
  }
});
