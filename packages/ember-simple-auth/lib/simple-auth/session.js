/**
  __The session provides access to the current authentication state as well as
  any data the authenticator resolved with__ (see
  [`Authenticators.Base#authenticate`](#SimpleAuth-Authenticators-Base-authenticate)).
  It is created when Ember Simple Auth is set up and __injected into all
  controllers and routes so that these parts of the application can always
  access the current authentication state and other data__, depending on the
  authenticator in use and whether the session is actually authenticated (see
  [`Authenticators.Base`](#SimpleAuth-Authenticators-Base)).

  The session also provides methods to authenticate and to invalidate itself
  (see
  [`Session#authenticate`](#SimpleAuth-Session-authenticate),
  [`Session#invaldiate`](#SimpleAuth-Session-invaldiate)).
  These methods are usually invoked through actions from routes or controllers.
  To authenticate the session manually, simple call the
  [`Session#authenticate`](#SimpleAuth-Session-authenticate)
  method with the authenticator factory to use as well as any options the
  authenticator needs to authenticate the session:

  ```js
  this.get('session').authenticate('authenticator:custom', { some: 'option' }).then(function() {
    // authentication was successful
  }, function() {
    // authentication failed
  });
  ```

  The session also observes the store and - if it is authenticated - the
  authenticator for changes (see
  [`Authenticators.Base`](#SimpleAuth-Authenticators-Base)
  end [`Stores.Base`](#SimpleAuth-Stores-Base)).

  @class Session
  @namespace SimpleAuth
  @module simple-auth/session
  @extends Ember.ObjectProxy
  @uses Ember.Evented
*/
export default Ember.ObjectProxy.extend(Ember.Evented, {
  /**
    Triggered __whenever the session is successfully authenticated__. When the
    application uses the
    [`ApplicationRouteMixin` mixin](#SimpleAuth-ApplicationRouteMixin),
    [`ApplicationRouteMixin.actions#sessionAuthenticationSucceeded`](#SimpleAuth-ApplicationRouteMixin-sessionAuthenticationSucceeded)
    will be invoked whenever this event is triggered.

    @event sessionAuthenticationSucceeded
  */
  /**
    Triggered __whenever an attempt to authenticate the session fails__. When
    the application uses the
    [`ApplicationRouteMixin` mixin](#SimpleAuth-ApplicationRouteMixin),
    [`ApplicationRouteMixin.actions#sessionAuthenticationFailed`](#SimpleAuth-ApplicationRouteMixin-sessionAuthenticationFailed)
    will be invoked whenever this event is triggered.

    @event sessionAuthenticationFailed
    @param {Object} error The error object; this depends on the authenticator in use, see [SimpleAuth.Authenticators.Base#authenticate](#SimpleAuth-Authenticators-Base-authenticate)
  */
  /**
    Triggered __whenever the session is successfully invalidated__. When the
    application uses the
    [`ApplicationRouteMixin` mixin](#SimpleAuth-ApplicationRouteMixin),
    [`ApplicationRouteMixin.actions#sessionInvalidationSucceeded`](#SimpleAuth-ApplicationRouteMixin-sessionInvalidationSucceeded)
    will be invoked whenever this event is triggered.

    @event sessionInvalidationSucceeded
  */
  /**
    Triggered __whenever an attempt to invalidate the session fails__. When the
    application uses the
    [`ApplicationRouteMixin` mixin](#SimpleAuth-ApplicationRouteMixin),
    [`ApplicationRouteMixin.actions#sessionInvalidationFailed`](#SimpleAuth-ApplicationRouteMixin-sessionInvalidationFailed)
    will be invoked whenever this event is triggered.

    @event sessionInvalidationFailed
    @param {Object} error The error object; this depends on the authenticator in use, see [SimpleAuth.Authenticators.Base#invalidate](#SimpleAuth-Authenticators-Base-invalidate)
  */
  /**
    Triggered __whenever the server rejects the authorization information
    passed with a request and responds with status 401__. When the application
    uses the
    [`ApplicationRouteMixin` mixin](#SimpleAuth-ApplicationRouteMixin),
    [`ApplicationRouteMixin.actions#authorizationFailed`](#SimpleAuth-ApplicationRouteMixin-authorizationFailed)
    will be invoked whenever this event is triggered.

    @event authorizationFailed
  */

  /**
    The authenticator factory to use as it is registered with Ember's
    container, see
    [Ember's API docs](http://emberjs.com/api/classes/Ember.Application.html#method_register).
    This is only set when the session is currently authenticated.

    @property authenticator
    @type String
    @readOnly
    @default null
  */
  authenticator: null,
  /**
    The store used to persist session properties.

    @property store
    @type SimpleAuth.Stores.Base
    @readOnly
    @default null
  */
  store: null,
  /**
    The Ember.js container,

    @property container
    @type Container
    @readOnly
    @default null
  */
  container: null,
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
  content: null,

  /**
    Initializes the content object so references aren't shared across
    instances.

    @method initializeContent
    @private
  */
  initializeContent: Ember.on('init', function() {
    this.set('content', { secure: {} });
  }),

  /**
    Authenticates the session with an `authenticator` and appropriate
    `options`. __This delegates the actual authentication work to the
    `authenticator`__ and handles the returned promise accordingly (see
    [`Authenticators.Base#authenticate`](#SimpleAuth-Authenticators-Base-authenticate)).
    All data the authenticator resolves with will be saved in the session's
    `secure` property.

    __This method returns a promise itself. A resolving promise indicates that
    the session was successfully authenticated__ while a rejecting promise
    indicates that authentication failed and the session remains
    unauthenticated.

    @method authenticate
    @param {String} authenticator The authenticator factory to use as it is registered with Ember's container, see [Ember's API docs](http://emberjs.com/api/classes/Ember.Application.html#method_register)
    @param {Any} [...args] The arguments to pass to the authenticator; depending on the type of authenticator these might be a set of credentials, a Facebook OAuth Token, etc.
    @return {Ember.RSVP.Promise} A promise that resolves when the session was authenticated successfully
  */
  authenticate: function() {
    var args          = Array.prototype.slice.call(arguments);
    var authenticator = args.shift();
    Ember.assert('Session#authenticate requires the authenticator factory to be specified, was "' + authenticator + '"!', !Ember.isEmpty(authenticator));
    var _this            = this;
    var theAuthenticator = this.container.lookup(authenticator);
    Ember.assert('No authenticator for factory "' + authenticator + '" could be found!', !Ember.isNone(theAuthenticator));
    return new Ember.RSVP.Promise(function(resolve, reject) {
      theAuthenticator.authenticate.apply(theAuthenticator, args).then(function(content) {
        _this.setup(authenticator, content, true);
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
    [`Session#authenticator`](#SimpleAuth-Session-authenticator)). __This
    invokes the authenticator's `invalidate` method and handles the returned
    promise accordingly__ (see
    [`Authenticators.Base#invalidate`](#SimpleAuth-Authenticators-Base-invalidate)).

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
    Ember.assert('Session#invalidate requires the session to be authenticated!', this.get('isAuthenticated'));
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var authenticator = _this.container.lookup(_this.authenticator);
      authenticator.invalidate(_this.content.secure).then(function() {
        authenticator.off('sessionDataUpdated');
        _this.clear(true);
        resolve();
      }, function(error) {
        _this.trigger('sessionInvalidationFailed', error);
        reject(error);
      });
    });
  },

  /**
    @method restore
    @private
  */
  restore: function() {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var restoredContent = _this.store.restore();
      var authenticator   = (restoredContent.secure || {}).authenticator;
      if (!!authenticator) {
        delete restoredContent.secure.authenticator;
        _this.container.lookup(authenticator).restore(restoredContent.secure).then(function(content) {
          _this.set('content', restoredContent);
          _this.setup(authenticator, content);
          resolve();
        }, function() {
          _this.clear();
          reject();
        });
      } else {
        _this.clear();
        reject();
      }
    });
  },

  /**
    @method setup
    @private
  */
  setup: function(authenticator, secureContent, trigger) {
    trigger = !!trigger && !this.get('isAuthenticated');
    this.beginPropertyChanges();
    this.setProperties({
      isAuthenticated: true,
      authenticator:   authenticator
    });
    Ember.set(this.content, 'secure', secureContent);
    this.bindToAuthenticatorEvents();
    this.updateStore();
    this.endPropertyChanges();
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
    this.beginPropertyChanges();
    this.setProperties({
      isAuthenticated: false,
      authenticator:   null
    });
    Ember.set(this.content, 'secure', {});
    this.updateStore();
    this.endPropertyChanges();
    if (trigger) {
      this.trigger('sessionInvalidationSucceeded');
    }
  },

  /**
    @method setUnknownProperty
    @private
  */
  setUnknownProperty: function(key, value) {
    Ember.assert('"secure" is a reserved key used by Ember Simple Auth!', key !== 'secure');
    var result = this._super(key, value);
    this.updateStore();
    return result;
  },

  /**
    @method updateStore
    @private
  */
  updateStore: function() {
    var data = this.content;
    if (!Ember.isEmpty(this.authenticator)) {
      Ember.set(data, 'secure', Ember.merge({ authenticator: this.authenticator }, data.secure || {}));
    }
    this.store.persist(data);
  },

  /**
    @method bindToAuthenticatorEvents
    @private
  */
  bindToAuthenticatorEvents: function() {
    var _this = this;
    var authenticator = this.container.lookup(this.authenticator);
    authenticator.off('sessionDataUpdated');
    authenticator.off('sessionDataInvalidated');
    authenticator.on('sessionDataUpdated', function(content) {
      _this.setup(_this.authenticator, content);
    });
    authenticator.on('sessionDataInvalidated', function(content) {
      _this.clear(true);
    });
  },

  /**
    @method bindToStoreEvents
    @private
  */
  bindToStoreEvents: Ember.observer('store', function() {
    var _this = this;
    this.store.on('sessionDataUpdated', function(content) {
      var authenticator = (content.secure || {}).authenticator;
      if (!!authenticator) {
        delete content.secure.authenticator;
        _this.container.lookup(authenticator).restore(content.secure).then(function(secureContent) {
          _this.set('content', content);
          _this.setup(authenticator, secureContent, true);
        }, function() {
          _this.set('content', content);
          _this.clear(true);
        });
      } else {
        _this.set('content', content);
        _this.clear(true);
      }
    });
  })
});
