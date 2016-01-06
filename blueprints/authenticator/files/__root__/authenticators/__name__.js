<%= imports %>

export default <%= baseClass %>.extend({
  <%= properties %>
  authenticate: function(data) {
    return Ember.RSVP.resolve(data);
  }
});
