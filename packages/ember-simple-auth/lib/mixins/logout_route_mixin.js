Ember.SimpleAuth.LogoutRouteMixin = Ember.Mixin.create({
  beforeModel: function() {
    var self = this;
    Ember.$.ajax({
      url:  Ember.SimpleAuth.serverSessionRoute,
      type: 'DELETE'
    }).always(function(response) {
      self.get('session').destroy();
      self.transitionTo(Ember.SimpleAuth.routeAfterLogout);
    });
  }
});
