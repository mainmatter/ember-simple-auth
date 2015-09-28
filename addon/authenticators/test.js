import Ember from 'ember';
import Base from './base';

const { RSVP } = Ember;

export default Base.extend({
  restore(data) {
    return RSVP.resolve(data);
  },

  authenticate(data) {
    return RSVP.resolve(data);
  },

  invalidate() {
    return RSVP.resolve();
  }
});
