import Ember from 'ember';
import Base from './base';

export default Base.extend({
  restore() {
    return Ember.RSVP.resolve();
  },

  authenticate(data) {
    return Ember.RSVP.resolve(data);
  },

  invalidate() {
    return Ember.RSVP.resolve();
  }
});
