Ember.SimpleAuth.Session = Ember.Object.extend({
  init: function() {
    this._super();
    this.setProperties({
      authToken:       sessionStorage.authToken,
      refreshToken:    sessionStorage.refreshToken,
      authTokenExpiry: sessionStorage.authTokenExpiry
    });
    this.handleAuthTokenRefresh();
  },

  setup: function(data) {
    data = data || {};
    this.setProperties({
      authToken:       data.access_token,
      refreshToken:    (data.refresh_token || this.get('refreshToken')),
      authTokenExpiry: (data.expires_in > 0 ? data.expires_in * 1000 : this.get('authTokenExpiry')) || 0
    });
  },

  destroy: function() {
    this.setProperties({
      authToken:       undefined,
      refreshToken:    undefined,
      authTokenExpiry: undefined
    });
  },

  isAuthenticated: Ember.computed('authToken', function() {
    return !Ember.isEmpty(this.get('authToken'));
  }),

  handlePropertyChange: function(property) {
    var value = this.get(property);
    if (Ember.isEmpty(value)) {
      delete sessionStorage[property];
    } else {
      sessionStorage[property] = value;
    }
  },

  authTokenObserver: Ember.observer(function() {
    this.handlePropertyChange('authToken');
  }, 'authToken'),

  refreshTokenObserver: Ember.observer(function() {
    this.handlePropertyChange('refreshToken');
    this.handleAuthTokenRefresh();
  }, 'refreshToken'),

  authTokenExpiryObserver: Ember.observer(function() {
    this.handlePropertyChange('authTokenExpiry');
    this.handleAuthTokenRefresh();
  }, 'authTokenExpiry'),

  handleAuthTokenRefresh: function() {
    if (Ember.SimpleAuth.autoRefreshToken) {
      Ember.run.cancel(this.get('refreshAuthTokenTimeout'));
      this.set('refreshAuthTokenTimeout', undefined);
      var waitTime = this.get('authTokenExpiry') - 5000;
      if (!Ember.isEmpty(this.get('refreshToken')) && waitTime > 0) {
        this.set('refreshAuthTokenTimeout', Ember.run.later(this, function() {
          var self = this;
          Ember.$.ajax(Ember.SimpleAuth.serverURL, {
            type:        'POST',
            data:        'grant_type=refresh_token&refresh_token=' + this.get('refreshToken'),
            contentType: 'application/x-www-form-urlencoded'
          }).then(function(response) {
            self.setup(response);
            self.handleAuthTokenRefresh();
          });
        }, waitTime));
      }
    }
  }
});
