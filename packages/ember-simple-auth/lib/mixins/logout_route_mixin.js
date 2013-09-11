Ember.SimpleAuth.LogoutRoute = Ember.Mixin.create({
  beforeModel: function() {
    var self = this;
    Ember.$.ajax({
      url:  Ember.SimpleAuth.baseUrl + '/session',
      type: 'DELETE'
    }).always(function(response) {
      this.get('session').logout();
      self.transitionToRoute(Ember.SimpleAuth.routeAfterLogout);
    });
  }
});
