var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

/**
  __The session provides access to the current authentication state as well as
  any data the authenticator resolved with__ (see
  [Ember.SimpleAuth.Authenticators.Base#authenticate](#Ember-SimpleAuth-Authenticators-Base-authenticate)).
  It is created when Ember.SimpleAuth is set up (see
  [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup)) and __injected into all
  models, controllers, routes and views so that all parts of the application
  can always access the current authentication state and other data__,
  depending on the used authenticator and whether the session is actually
  authenticated (see
  [Ember.SimpleAuth.Authenticators.Base](#Ember-SimpleAuth-Authenticators-Base))).

  The session also provides methods to authenticate it and to invalidate itself
  (see
  [Ember.SimpleAuth.Session#authenticate](#Ember-SimpleAuth-Session-authenticate),
  [Ember.SimpleAuth.Session#invaldiate](#Ember-SimpleAuth-Session-invaldiate)).
  These methods are usually invoked through actions from routes or controllers.
  To authenticate the session manually, simple call the
  [Ember.SimpleAuth.Session#authenticate](#Ember-SimpleAuth-Session-authenticate)
  method with the authenticator factory to use as well as any options the
  authenticator needs to authenticate the session:

  ```javascript
    this.get('session').authenticate('authenticatorFactory', { some: 'option' }).then(function() {
      // authentication was successful
    }, function() {
      // authentication failed
    });
  ```

  When the session's authentication state changes or an attempt to change it
  fails, it will trigger the `'sessionAuthenticationSucceeded'`,
  `'sessionAuthenticationFailed'`, `'sessionInvalidationSucceeded'` or
  `'sessionInvalidationFailed'` events.

  The session also observes the store and - if it is authenticated - the
  authenticator for changes (see
  [Ember.SimpleAuth.Authenticators.Base](#Ember-SimpleAuth-Authenticators-Base)
  end [Ember.SimpleAuth.Stores.Base](#Ember-SimpleAuth-Stores-Base)).

  @class Session
  @extends Ember.ObjectProxy
  @uses Ember.Evented
*/
var Session = Ember.ObjectProxy.extend(Ember.Evented, {
  /**
    The authenticator factory used to authenticate the session. This is only
    set when the session is currently authenticated.

    @property authenticatorFactory
    @type String
    @readOnly
    @default null
  */
  authenticatorFactory: null,
  /**
    The store used to persist session properties. This is assigned during
    Ember.SimpleAuth's setup and can be configured there
    (see [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup)).

    @property store
    @type Ember.SimpleAuth.Stores.Base
    @readOnly
    @default null
  */
  store: null,
  /**
    Returns whether the session is currently authenticated.

    @property isAuthenticated
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
  content: {},

  /**
    @method init
    @private
  */
  init: function() {
    var _this = this;
    this.bindToStoreEvents();
    var restoredContent      = this.store.restore();
    var authenticatorFactory = restoredContent.authenticatorFactory;
    if (!!authenticatorFactory) {
      delete restoredContent.authenticatorFactory;
      this.container.lookup(authenticatorFactory).restore(restoredContent).then(function(content) {
        _this.setup(authenticatorFactory, content);
      }, function() {
        _this.store.clear();
      });
    } else {
      this.store.clear();
    }
  },

  /**
    Authentices the session with an `authenticator` and appropriate `options`.
    __This delegates the actual authentication work to the `authenticator`__
    and handles the returned promise accordingly (see
    [Ember.SimpleAuth.Authenticators.Base#authenticate](#Ember-SimpleAuth-Authenticators-Base-authenticate)).
    All data the authenticator resolves with will be saved in the session.

    __This method returns a promise itself. A resolving promise indicates that
    the session was successfully authenticated__ while a rejecting promise
    indicates that authentication failed and the session remains
    unauthenticated.

    @method authenticate
    @param {String} authenticatorFactory The authenticator factory to use as it is registered with Ember's container, see [Ember's API docs](http://emberjs.com/api/classes/Ember.Application.html#method_register)
    @param {Object} options The options to pass to the authenticator; depending on the type of authenticator these might be a set of credentials, a Facebook OAuth Token, etc.
    @return {Ember.RSVP.Promise} A promise that resolves when the session was authenticated successfully
  */
  authenticate: function(authenticatorFactory, options) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      _this.container.lookup(authenticatorFactory).authenticate(options).then(function(content) {
        _this.setup(authenticatorFactory, content, true);
        resolve();
      }, function(error) {
        _this.clear();
        _this.trigger('sessionAuthenticationFailed', error);
        reject(error);
      });
    });
  },

  /**
    Invalidates the session with the authenticator it is currently
    authenticated with (see
    [Ember.SimpleAuth.Session#authenticatorFactory](#Ember-SimpleAuth-Session-authenticatorFactory)).
    __This invokes the authenticator's `invalidate` method and handles the
    returned promise accordingly__ (see
    [Ember.SimpleAuth.Authenticators.Base#invalidate](#Ember-SimpleAuth-Authenticators-Base-invalidate)).

    __This method returns a promise itself. A resolving promise indicates that
    the session was successfully invalidated__ while a rejecting promise
    indicates that the promise returned by the `authenticator` rejected and
    thus invalidation was cancelled. In that case the session remains
    authenticated. Once the session is successfully invalidated it clears all
    of its data.

    @method invalidate
    @return {Ember.RSVP.Promise} A promise that resolves when the session was invalidated successfully
  */
  invalidate: function() {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var authenticator = _this.container.lookup(_this.authenticatorFactory);
      authenticator.invalidate(_this.content).then(function() {
        authenticator.off('updated');
        _this.clear(true);
        resolve();
      }, function(error) {
        _this.trigger('sessionInvalidationFailed', error);
        reject(error);
      });
    });
  },

  /**
    @method setup
    @private
  */
  setup: function(authenticatorFactory, content, trigger) {
    trigger = !!trigger && !this.get('isAuthenticated');
    this.setProperties({
      isAuthenticated:      true,
      authenticatorFactory: authenticatorFactory,
      content:              content
    });
    this.bindToAuthenticatorEvents();
    var data = Ember.$.extend({ authenticatorFactory: authenticatorFactory }, this.content);
    this.store.replace(data);
    if (trigger) {
      this.trigger('sessionAuthenticationSucceeded');
    }
  },

  /**
    @method clear
    @private
  */
  clear: function(trigger) {
    trigger = !!trigger && this.get('isAuthenticated');
    this.setProperties({
      isAuthenticated:      false,
      authenticatorFactory: null,
      content:              {}
    });
    this.store.clear();
    if (trigger) {
      this.trigger('sessionInvalidationSucceeded');
    }
  },

  /**
    @method bindToAuthenticatorEvents
    @private
  */
  bindToAuthenticatorEvents: function() {
    var _this = this;
    var authenticator = this.container.lookup(this.authenticatorFactory);
    authenticator.off('updated');
    authenticator.off('invalidated');
    authenticator.on('updated', function(content) {
      _this.setup(_this.authenticatorFactory, content);
    });
    authenticator.on('invalidated', function(content) {
      _this.clear(true);
    });
  },

  /**
    @method bindToStoreEvents
    @private
  */
  bindToStoreEvents: function() {
    var _this = this;
    this.store.on('updated', function(content) {
      var authenticatorFactory = content.authenticatorFactory;
      if (!!authenticatorFactory) {
        delete content.authenticatorFactory;
        _this.container.lookup(authenticatorFactory).restore(content).then(function(content) {
          _this.setup(authenticatorFactory, content, true);
        }, function() {
          _this.clear(true);
        });
      } else {
        _this.clear(true);
      }
    });
  }
});

export { Session };
