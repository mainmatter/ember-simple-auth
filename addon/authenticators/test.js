import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';

export default Base.extend({
  restore: function() {
    return Ember.RSVP.resolve();
  },

  authenticate: function() {
    return Ember.RSVP.resolve();
  },

  invalidate: function() {
    return Ember.RSVP.resolve();
  }
});
