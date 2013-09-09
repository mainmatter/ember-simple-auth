EmberAuthSimple.Session = Ember.Object.extend({
  init: function() {
    this._super();
    this.set('authToken', sessionStorage.authToken);
  },
  authTokenChanged: function() {
    sessionStorage.authToken = this.get('authToken');
  }.observes('authToken'),
});
