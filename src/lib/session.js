EmberAuthSimple.Session = Ember.Object.extend({
  init: function() {
    this._super();
    this.set('authToken', $.cookie('auth_token'));
  },
  authTokenChanged: function() {
    $.cookie('authToken', this.get('authToken'));
  }.observes('authToken'),
});
