import Ember from 'ember';
import Base from './base';

const { RSVP } = Ember;

export default Base.extend({
  restore() {
    return RSVP.resolve();
  },

  authenticate(data) {
    return RSVP.resolve(data);
  },

  invalidate() {
    return RSVP.resolve();
  }
});
