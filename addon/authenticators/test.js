import Ember from 'ember';
import Base from './base';

export default Base.extend({
  restore() {
    return Ember.RSVP.resolve();
  },

  authenticate() {
    return Ember.RSVP.resolve();
  },

  invalidate() {
    return Ember.RSVP.resolve();
  }
});
