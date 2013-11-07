/**
  This class holds the current access token and other session data. There will always be a
  session regardless of whether a user is currently authenticated or not. That (singleton) instance
  of this class is automatically injected into all models, controller, routes and views so you should
  never instantiate this class directly but always use the auto-injected instance.

  @class Session
  @namespace Ember.SimpleAuth
  @extends Ember.Object
  @constructor
*/
Ember.SimpleAuth.Session = Ember.Object.extend({

  init: function() {
    this._super();
    this.syncProperties();
    this.handleAuthTokenRefresh();
  },

  /**
    Sets up the session from a plain JavaScript object. This does not create a new instance but sets up
    the instance with the data that is passed. Any data assigned here is also persisted in a session cookie (see http://en.wikipedia.org/wiki/HTTP_cookie#Session_cookie) so it survives a page reload.

    @method setup
    @param {Object} data The data to set the session up with
      @param {String} data.access_token The access token that will be included in the `Authorization` header
      @param {String} [data.refresh_token] An optional refresh token that will be used for obtaining fresh tokens
      @param {String} [data.expires_in] An optional expiry for the access_token in seconds; if both expires_in and refresh_token are set,
        Ember.SimpleAuth will automatically refresh access tokens before they expire

    @example
      ```javascript
      this.get('session').setup({
        access_token:  'the secret token!',
        refresh_token: 'a secret refresh token!',
        expires_in:    3600 // 1 minute
      })
      ```
  */
  setup: function(data) {
    data = data || {};
    this.setProperties({
      authToken:       data.access_token,
      refreshToken:    (data.refresh_token || this.get('refreshToken')),
      authTokenExpiry: (data.expires_in > 0 ? data.expires_in * 1000 : this.get('authTokenExpiry')) || 0
    });
  },

  /**
    Destroys the session by setting all properties to undefined (see [Session#setup](#Ember.SimpleAuth.Session_setup)). This also deletes any
    saved data from the session cookie and effectively logs the current user out.

    @method destroy
  */
  destroy: function() {
    this.setProperties({
      authToken:       undefined,
      refreshToken:    undefined,
      authTokenExpiry: undefined
    });
  },

  /**
    Returns whether a user is currently authenticated.

    @method isAuthenticated
    @return {Boolean} true if a user is authenticated, false otherwise
  */
  isAuthenticated: Ember.computed('authToken', function() {
    return !Ember.isEmpty(this.get('authToken'));
  }),

  /**
    @method syncProperties
    @private
  */
  syncProperties: function() {
    this.setProperties({
      authToken:       this.load('authToken'),
      refreshToken:    this.load('refreshToken'),
      authTokenExpiry: this.load('authTokenExpiry')
    });
    Ember.run.cancel(Ember.SimpleAuth.Session._SYNC_PROPERTIES_TIMEOUT_);
    Ember.SimpleAuth.Session._SYNC_PROPERTIES_TIMEOUT_ = Ember.run.later(this, this.syncProperties, 500);
  },

  /**
    @method load
    @private
  */
  load: function(property) {
    var value = document.cookie.match(new RegExp(property + '=([^;]+)')) || [];
    if (Ember.isEmpty(value)) {
      return undefined;
    } else {
      return decodeURIComponent(value[1] || '');
    }
  },

  /**
    @method store
    @private
  */
  store: function(property) {
    document.cookie = property + '=' + encodeURIComponent(this.get(property) || '');
  },

  /**
    @method authTokenObserver
    @private
  */
  authTokenObserver: Ember.observer(function() {
    this.store('authToken');
  }, 'authToken'),

  /**
    @method refreshTokenObserver
    @private
  */
  refreshTokenObserver: Ember.observer(function() {
    this.store('refreshToken');
    this.handleAuthTokenRefresh();
  }, 'refreshToken'),

  /**
    @method authTokenExpiryObserver
    @private
  */
  authTokenExpiryObserver: Ember.observer(function() {
    this.store('authTokenExpiry');
    this.handleAuthTokenRefresh();
  }, 'authTokenExpiry'),

  /**
    @method handleAuthTokenRefresh
    @private
  */
  handleAuthTokenRefresh: function() {
    if (Ember.SimpleAuth.autoRefreshToken) {
      Ember.run.cancel(this.get('refreshAuthTokenTimeout'));
      this.set('refreshAuthTokenTimeout', undefined);
      var waitTime = this.get('authTokenExpiry') - 5000;
      if (!Ember.isEmpty(this.get('refreshToken')) && waitTime > 0) {
        this.set('refreshAuthTokenTimeout', Ember.run.later(this, function() {
          var self = this;
          Ember.$.ajax(Ember.SimpleAuth.serverTokenEndpoint, {
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
