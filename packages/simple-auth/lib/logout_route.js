/**
@module simple-auth
*/

SimpleAuth.LogoutRoute = Ember.Mixin.create({
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
