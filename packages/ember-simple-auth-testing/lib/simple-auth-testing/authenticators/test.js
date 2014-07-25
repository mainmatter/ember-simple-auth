import Base from 'simple-auth/authenticators/base';

export default Base.extend({
  restore: function(data) {
    return new Ember.RSVP.resolve();
  },

  authenticate: function(options) {
    return new Ember.RSVP.resolve();
  },

  invalidate: function(data) {
    return new Ember.RSVP.resolve();
  }
});
