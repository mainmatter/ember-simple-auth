'use strict';

/**
  This class holds the current authentication state and data the authenticator sets. There will always be a
  session regardless of whether a user is currently authenticated or not. That (singleton) instance
  of this class is automatically injected into all models, controller, routes and views so you should
  never instantiate this class directly but always use the auto-injected instance.

  @class Session
  @namespace Ember.SimpleAuth
  @extends Ember.ObjectProxy
  @constructor
*/
Ember.SimpleAuth.Session = Ember.ObjectProxy.extend({
  authenticator:       null,
  store:               null,
  isAuthenticated:     false,
  attemptedTransition: null,
  content:             {},

  /**
    @method init
    @private
  */
  init: function() {
    var _this         = this;
    var store         = this.get('store');
    var authenticator = this.createAuthenticator(store.load('authenticator'));
    this.listenToStoreUpdates();
    if (!!authenticator) {
      var restoredContent = store.restore();
      authenticator.restore(restoredContent).then(function(content) {
        _this.setup(authenticator, content);
      });
    } else {
      store.clear();
    }
  },

  /**
    Sets up the session from a plain JavaScript object. This does not create a new instance but sets up
    the instance with the data that is passed. Any data assigned here is also persisted in a session cookie (see http://en.wikipedia.org/wiki/HTTP_cookie#Session_cookie) so it survives a page reload.

    @method setup
    @param {Object} data The data to set the session up with
      @param {String} data.authToken The access token that will be included in the `Authorization` header
      @param {String} [data.refreshToken] An optional refresh token that will be used for obtaining fresh tokens
      @param {String} [data.authTokenExpiry] An optional expiry for the `authToken` in seconds; if both `authTokenExpiry` and `refreshToken` are set,
        Ember.SimpleAuth will automatically refresh access tokens before they expire

    @example
      ```javascript
      this.get('session').setup({
        authToken: 'the secret token!'
      })
      ```
  */
  authenticate: function(authenticator, options) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      authenticator.authenticate(options).then(function(content) {
        _this.setup(authenticator, content);
        resolve();
      }, function(error) {
        reject(error);
      });
    });
  },

  /**
    Destroys the session by setting all properties to undefined (see [Session#setup](#Ember.SimpleAuth.Session_setup)). This also deletes any
    saved data from the session cookie and effectively logs the current user out.

    @method destroy
  */
  unauthenticate: function() {
    var _this         = this;
    var authenticator = this.get('authenticator');
    authenticator.unauthenticate().then(function() {
      authenticator.off('updated_session_data');
      _this.destroy();
    });
  },

  setup: function(authenticator, content) {
    this.setProperties({
      isAuthenticated: true,
      authenticator:   authenticator,
      content:         content
    });
  },

  destroy: function(authenticator, content) {
    this.setProperties({
      isAuthenticated: false,
      authenticator:   undefined,
      content:         {}
    });
  },

  createAuthenticator: function(className) {
    var authenticatorClass = Ember.A((className || '').split('.')).reduce(function(acc, klass) {
      return (acc || {})[klass];
    }, window);
    return Ember.tryInvoke(authenticatorClass, 'create');
  },

  /**
    @method listenToStoreUpdates
    @private
  */
  listenToStoreUpdates: function() {
    var _this = this;
    var store = this.get('store');
    store.on('updated_session_data', function(content) {
      var authenticator = this.createAuthenticator(content.authenticator);
      if (!!authenticator) {
        authenticator.restore(content).then(function(content) {
          _this.setup(authenticator, content);
        }, function() {
          _this.destroy();
        });
      } else {
        _this.destroy();
      }
    });
  },

  contentObserver: Ember.observer(function() {
    this.get('store').clear();
    this.get('store').save(this.get('content'));
    var authenticator = this.get('authenticator');
    if (!!authenticator) {
      this.get('store').save({ authenticator: authenticator.constructor.toString() });
    }
  }, 'content'),

  /**
    @method authenticatorObserver
    @private
  */
  authenticatorObserver: Ember.observer(function() {
    var _this         = this;
    var authenticator = this.get('authenticator');
    if (!!authenticator) {
      this.get('store').save({ authenticator: authenticator.constructor.toString() });
      authenticator.on('updated_session_data', function(content) {
        _this.set('content', content);
      });
    } else {
      this.get('store').save({ authenticator: undefined });
    }
  }, 'authenticator'),

  /**
    @method storeObserver
    @private
  */
  storeObserver: Ember.observer(function() {
    this.listenToStoreUpdates();
  }, 'store')
});
