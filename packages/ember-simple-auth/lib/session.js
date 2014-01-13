'use strict';

function classifyString(className) {
  return Ember.A((className || '').split('.')).reduce(function(acc, klass) {
    return (acc || {})[klass];
  }, window);
}

/**
  The session provides access to the current authentication state as well as
  any properties resolved by the authenticator
  (see Ember.SimpleAuth.Authenticators.Base#authenticate). It is created when
  Ember.SimpleAuth is set up and injected into all models, controllers, routes
  and views so that all parts of the application can always access the current
  authentication state and other properties, depending on the used
  authenticator.

  The session also provides methods to authenticate the user and to invalidate
  itself (see Ember.SimpleAuth.Session#authenticate,
  Ember.SimpleAuth.Session#invaldiate). These methods are usually invoked
  throught actions from routes or controllers.

  @class Session
  @namespace Ember.SimpleAuth
  @extends Ember.ObjectProxy
  @constructor
*/
Ember.SimpleAuth.Session = Ember.ObjectProxy.extend({
  /**
    The authenticator used to authenticate the session. This is only set when
    the session is currently authenticated.

    @property authenticator
    @type Ember.SimpleAuth.Authenticators.Base
    @readOnly
    @default null
  */
  authenticator: null,
  /**
    The store used to persist session properties. This is assigned during
    Ember.SimpleAuth's setup and can be specified there
    (see Ember.SimpleAuth#setup).

    @property store
    @type Ember.SimpleAuth.Stores.Base
    @readOnly
    @default null
  */
  store: null,
  /**
    Holds whether the session is currently authenticated.

    @property authenticated
    @type Boolean
    @readOnly
    @default false
  */
  isAuthenticated: false,
  /**
    @property attemptedTransition
    @private
  */
  attemptedTransition: null,
  /**
    @property content
    @private
  */
  content: null,

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
    Authentices the session with an `authenticator` and appropriate `options`.
    This delegates the actual authentication work (e.g. making server requests
    etc.) to the specified `authenticator` and handles the returned promise
    accordingly (see Ember.SimpleAuth.Authenticators.Base#authenticate).

    This method returns a promise itself. A resolving promise indicates that
    the session was successfully authenticated while a rejecting promise
    indicates that authentication failed and the session remains
    unauthenticated.

    @method authenticate
    @param {Ember.SimpleAuth.Authenticators.Base} authToken The authenticator to authenticate with
    @param {Object} options The options to pass to the authenticator; depending on the type of authenticator these might be a set of credentials etc.
    @return {Ember.RSVP.Promise} A promise that resolves when the session was authenticated successfully
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
    Invalidates the session with the current `authenticator`. This will invoke
    the `authenticator`'s `invalidate` hook and handles the returned promise
    accordingly (see Ember.SimpleAuth.Authenticators.Base#invalidate).

    This method returns a promise itself. A resolving promise indicates that
    the session was successfully invalidated while a rejecting promise
    indicates that the promise returned by the `authenticator` rejected and
    thus invalidation was cancelled. In that case the session remains
    authenticated.

    @method invalidate
    @return {Ember.RSVP.Promise} A promise that resolves when the session was invalidated successfully
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
