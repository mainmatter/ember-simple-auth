import Ember from 'ember';

const { typeOf, A } = Ember;

const ALLOWED_VALUE_TYPES = A(['string', 'number', 'boolean', 'null', 'undefined', 'date']);

export default Ember.ObjectProxy.extend({
  content: {},

  set(key, value) {
    let result = this._super(key, value);
    console.log('change from set:', key, value);
    return result;
  },

  setUnknownProperty(key, value) {
    window._sessionData = this;
    const valueType = typeOf(value);
    Ember.assert('"authenticated" is a reserved key used by Ember Simple Auth!', key !== 'authenticated');
    Ember.assert(`Only atomic values like strings, numbers, booleans and dates can be stored in the session, got "${valueType}"`, ALLOWED_VALUE_TYPES.contains(valueType));

    let result = this._super(key, value);
    console.log('change from setUnknownProperty:', key, value);
    return result;
  }
});
