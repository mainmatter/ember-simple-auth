Ember.SimpleAuth.LogoutActionableMixin = Ember.Mixin.create({
  actions: {
    logout: function() {
      var self = this;
      Ember.$.ajax(Ember.SimpleAuth.serverSessionRoute, { type: 'DELETE' }).always(function(response) {
        self.get('session').destroy();
        self.transitionTo(Ember.SimpleAuth.routeAfterLogout);
      });
    }
  }
});
