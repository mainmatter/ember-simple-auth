'use strict';

function classifyString(className) {
  return Ember.A((className || '').split('.')).reduce(function(acc, klass) {
    return (acc || {})[klass];
  }, window);
}

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
  content:             null,

  /**
    @method init
    @private
  */
  init: function() {
    var _this = this;
    this.bindToStoreEvents();
    var restoredContent = this.store.restore();
    var authenticator   = this.createAuthenticator(restoredContent.authenticator);
    if (!!authenticator) {
      delete restoredContent.authenticator;
      authenticator.restore(restoredContent).then(function(content) {
        _this.setup(authenticator, content);
      });
    } else {
      this.store.clear();
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
        _this.clear();
        reject(error);
      });
    });
  },

  /**
    Destroys the session by setting all properties to undefined (see [Session#setup](#Ember.SimpleAuth.Session_setup)). This also deletes any
    saved data from the session cookie and effectively logs the current user out.

    @method destroy
  */
  invalidate: function() {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      _this.authenticator.invalidate(_this.content).then(function() {
        _this.authenticator.off('ember-simple-auth:session-updated');
        _this.clear();
        resolve();
      }, function(error) {
        reject(error);
      });
    });
  },

  /**
    @method setup
    @private
  */
  setup: function(authenticator, content) {
    this.setProperties({
      isAuthenticated: true,
      authenticator:   authenticator,
      content:         content
    });
    this.bindToAuthenticatorEvents();
    var data = Ember.$.extend({
      authenticator: this.authenticator.constructor.toString()
    }, this.content);
    this.store.clear();
    this.store.persist(data);
  },

  /**
    @method clear
    @private
  */
  clear: function() {
    this.setProperties({
      isAuthenticated: false,
      authenticator:   null,
      content:         null
    });
    this.store.clear();
  },

  /**
    @method createAuthenticator
    @private
  */
  createAuthenticator: function(className) {
    var authenticatorClass = classifyString(className);
    return Ember.tryInvoke(authenticatorClass, 'create');
  },

  /**
    @method bindToAuthenticatorEvents
    @private
  */
  bindToAuthenticatorEvents: function() {
    var _this = this;
    this.authenticator.on('ember-simple-auth:session-updated', function(content) {
      _this.setup(_this.authenticator, content);
    });
  },

  /**
    @method bindToStoreEvents
    @private
  */
  bindToStoreEvents: function() {
    var _this = this;
    this.store.on('ember-simple-auth:session-updated', function(content) {
      var authenticator = _this.createAuthenticator(content.authenticator);
      if (!!authenticator) {
        delete content.authenticator;
        authenticator.restore(content).then(function(content) {
          _this.setup(authenticator, content);
        }, function() {
          _this.clear();
        });
      } else {
        _this.clear();
      }
    });
  }
});
