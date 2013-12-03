'use strict';

function classifyString(className) {
  return Ember.A((className || '').split('.')).reduce(function(acc, klass) { return (acc || {})[klass]; }, window);
}

/**
  This class holds the current authentication state and data the authenticator sets. There will always be a
  session regardless of whether a user is currently authenticated or not. That (singleton) instance
  of this class is automatically injected into all models, controller, routes and views so you should
  never instantiate this class directly but always use the auto-injected instance.

  @class Session
  @namespace Ember.SimpleAuth
  @extends Ember.Object
  @constructor
*/
Ember.SimpleAuth.Session = Ember.Object.extend({
  /**
    @method init
    @private
  */
  init: function() {
    var _this = this;
    var store = this.get('store');
    var authenticatorClass = classifyString(store.load('authenticator'));
    this.set('isAuthenticated', false);
    this.set('authenticator', Ember.tryInvoke(authenticatorClass, 'create'));
    if (!!this.get('authenticator')) {
      store.restore().then(function(properties) {
        _this.get('authenticator').restore(properties).then(function(properties) {
          _this.set('isAuthenticated', true);
          _this.updateSessionProperties(properties);
        });
      });
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
  setup: function(authenticator, options) {
    var _this = this;
    //TODO: fail if authenticated
    return new Ember.RSVP.Promise(function(resolve, reject) {
      authenticator.authenticate(options).then(function(properties) {
        _this.set('isAuthenticated', true);
        _this.set('authenticator', authenticator);
        _this.updateSessionProperties(properties);
        resolve();
      }, function(error) {
        _this.set('isAuthenticated', false);
        _this.set('authenticator', undefined);
        reject(error);
      });
    });
  },

  /**
    Destroys the session by setting all properties to undefined (see [Session#setup](#Ember.SimpleAuth.Session_setup)). This also deletes any
    saved data from the session cookie and effectively logs the current user out.

    @method destroy
  */
  destroy: function() {
    var _this         = this;
    var authenticator = this.get('authenticator');
    authenticator.unauthenticate().then(function(properties) {
      _this.set('isAuthenticated', false);
      authenticator.off('updated_session_data');
      _this.set('authenticator', undefined);
      _this.updateSessionProperties(properties);
    });
  },

  /**
    @method updateSessionProperties
    @private
  */
  updateSessionProperties: function(properties) {
    this.setProperties(properties);
    this.get('store').save(properties);
  },

  /**
    @method authenticatorObserver
    @private
  */
  authenticatorObserver: Ember.observer(function() {
    var _this         = this;
    var authenticator = this.get('authenticator');
    if (!!authenticator) {
      this.get('store').save({ authenticator: authenticator });
      authenticator.on('updated_session_data', function(properties) {
        _this.updateSessionProperties(properties);
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
    var _this = this;
    var stote = this.get('store');
    store.on('updated_session_data', function(properties) {
      _this.updateSessionProperties(properties);
    });
  }, 'store')
});
