import Base from 'simple-auth/authenticators/base';

export default Base.extend({
  restore: function(data) {
    return Ember.RSVP.resolve();
  },

  authenticate: function(options) {
    return Ember.RSVP.resolve();
  },

  invalidate: function(data) {
    return Ember.RSVP.resolve();
  }
});
