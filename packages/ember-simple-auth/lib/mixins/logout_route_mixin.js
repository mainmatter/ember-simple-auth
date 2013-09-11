Ember.SimpleAuth.LogoutRoute = Ember.Mixin.create({
  beforeModel: function() {
    var self = this;
    Ember.$.ajax({
      url:  Ember.SimpleAuth.baseUrl + '/session',
      type: 'DELETE'
    }).always(function(response) {
      this.set('session.authToken', undefined);
      self.transitionToRoute('login');
    });
  }
});
