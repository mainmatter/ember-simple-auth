Ember.SimpleAuth.Session = Ember.Object.extend({
  init: function() {
    this._super();
    this.set('authToken', sessionStorage.authToken);
  },
  setup: function(serverSession) {
    this.set('authToken', ((serverSession || {}).session || {}).authToken);
  },
  destroy: function() {
    this.set('authToken', undefined);
  },
  isAuthenticated: Ember.computed('authToken', function() {
    return !Ember.isEmpty(this.get('authToken'));
  }),
  authTokenObserver: Ember.observer(function() {
    var authToken = this.get('authToken');
    if (Ember.isEmpty(authToken)) {
      delete sessionStorage.authToken;
    } else {
      sessionStorage.authToken = this.get('authToken');
    }
  }, 'authToken')
});
