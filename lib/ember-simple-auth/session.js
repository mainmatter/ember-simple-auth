var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

/**
  __The session provides access to the current authentication state as well as
  any properties resolved by the authenticator__ (see
  [EmberSimpleAuth.Authenticators.Base#authenticate](#EmberSimpleAuth-Authenticators-Base-authenticate)).
  It is created when EmberSimpleAuth is set up (see
  [EmberSimpleAuth.setup](#EmberSimpleAuth-setup)) and __injected into all
  models, controllers, routes and views so that all parts of the application
  can always access the current authentication state and other properties__,
  depending on the used authenticator (see
  [EmberSimpleAuth.Authenticators.Base](#EmberSimpleAuth-Authenticators-Base))).

  The session also provides methods to authenticate the user and to invalidate
  itself (see
  [EmberSimpleAuth.Session#authenticate](#EmberSimpleAuth-Session-authenticate),
  [EmberSimpleAuth.Session#invaldiate](#EmberSimpleAuth-Session-invaldiate)
  These methods are usually invoked through actions from routes or controllers.

  @class Session
  @namespace EmberSimpleAuth
  @extends Ember.ObjectProxy
  @uses Ember.Evented
*/
var Session = Ember.ObjectProxy.extend(Ember.Evented, {
  /**
    The authenticator factory used to authenticate the session. This is only
    set when the session is currently authenticated.

    @property authenticator
    @type String
    @readOnly
    @default null
  */
  authenticatorFactory: null,
  /**
    The store used to persist session properties. This is assigned during
    EmberSimpleAuth's setup and can be specified there
    (see [EmberSimpleAuth.setup](#EmberSimpleAuth-setup)).

    @property store
    @type EmberSimpleAuth.Stores.Base
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
        if (!this.store.isLocked()) {
            Ember.Logger.debug('******** INIT: STORE IS NOT LOCKED: 1');
            _this.store.clear();
        } else {
            Ember.Logger.debug('******** INIT: STORE IS LOCKED: 1');
        }
      });
    } else {
        if (!this.store.isLocked()) {
            Ember.Logger.debug('******** INIT: STORE IS NOT LOCKED: 2');
            this.store.clear();
        } else {
            Ember.Logger.debug('******** INIT: STORE IS LOCKED: 2');
        }
    }
  },

  /**
    Authentices the session with an `authenticator` and appropriate `options`.
    __This delegates the actual authentication work to the `authenticator`__
    and handles the returned promise accordingly (see
    [EmberSimpleAuth.Authenticators.Base#authenticate](#EmberSimpleAuth-Authenticators-Base-authenticate)).

    __This method returns a promise itself. A resolving promise indicates that
    the session was successfully authenticated__ while a rejecting promise
    indicates that authentication failed and the session remains
    unauthenticated.

    @method authenticate
    @param {String} authenticatorFactory The authenticator factory to use as it is registered with Ember's container, see [Ember's API docs](http://emberjs.com/api/classes/Ember.Application.html#method_register)
    @param {Object} options The options to pass to the authenticator; depending on the type of authenticator these might be a set of credentials etc.
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
        _this.trigger('ember-simple-auth:session-authentication-failed', error);
        reject(error);
      });
    });
  },

  /**
    Invalidates the session with the current `authenticator`. __This invokes
    the `authenticator`'s `invalidate` hook and handles the returned promise
    accordingly__ (see
    [EmberSimpleAuth.Authenticators.Base#invalidate](#EmberSimpleAuth-Authenticators-Base-invalidate)).

    __This method returns a promise itself. A resolving promise indicates that
    the session was successfully invalidated__ while a rejecting promise
    indicates that the promise returned by the `authenticator` rejected and
    thus invalidation was cancelled. In that case the session remains
    authenticated.

    @method invalidate
    @return {Ember.RSVP.Promise} A promise that resolves when the session was invalidated successfully
  */
  invalidate: function() {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var authenticator = _this.container.lookup(_this.authenticatorFactory);
      authenticator.invalidate(_this.content).then(function() {
        authenticator.off('ember-simple-auth:session-updated');
        _this.clear(true);
        resolve();
      }, function(error) {
        _this.trigger('ember-simple-auth:session-invalidation-failed', error);
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

    if(!this.store.isLocked()) {
      Ember.Logger.debug('******** SETUP: STORE IS NOT LOCKED');
      Ember.Logger.debug('******** SETUP: LOCK');
      this.store.lock();
      Ember.Logger.debug('******** SETUP: CLEAR');
      this.store.clear();
      Ember.Logger.debug('******** SETUP: PERSIST');
      this.store.persist(data);
      Ember.Logger.debug('******** SETUP: UNLOCK');
      this.store.unlock();
    } else {
      Ember.Logger.debug('******** SETUP: STORE IS LOCKED');
    }

    if (trigger) {
        this.trigger('ember-simple-auth:session-authentication-succeeded');
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

    if(!this.store.isLocked()) {
        Ember.Logger.debug('******** CLEAR: CLEAR');
        this.store.clear();
    } else {
        Ember.debug('******** CLEAR: LOCKED');
    }

    // TODO
    if (trigger) {
      this.trigger('ember-simple-auth:session-invalidation-succeeded');
    }
  },

  /**
    @method bindToAuthenticatorEvents
    @private
  */
  bindToAuthenticatorEvents: function() {
    var _this = this;
    var authenticator = this.container.lookup(this.authenticatorFactory);
    authenticator.off('ember-simple-auth:session-updated');
    authenticator.on('ember-simple-auth:session-updated', function(content) {
      _this.setup(_this.authenticatorFactory, content);
    });
  },

  /**
    @method bindToStoreEvents
    @private
  */
  bindToStoreEvents: function() {
    var _this = this;
    this.store.on('ember-simple-auth:session-updated', function(content) {
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
