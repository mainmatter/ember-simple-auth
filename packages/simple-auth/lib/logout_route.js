SimpleAuth.LogoutRoute = Ember.Mixin.extend({
  beforeModel: function() {
    var self = this;
    $.ajax({
      url:  SimpleAuth.baseUrl + '/session',
      type: 'DELETE'
    }).always(function(response) {
      session.set('authToken', '');
      self.transitionToRoute('login');
    });
  }
});
