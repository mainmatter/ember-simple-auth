'use strict';

function extractLocationOrigin(location) {
  return location.protocol + '//' + location.hostname + (location.port !== '' ? ':' + location.port : '');
}

/**
  The main namespace for Ember.SimpleAuth.

  @class SimpleAuth
  @namespace Ember
  @static
**/
Ember.SimpleAuth = Ember.Namespace.create({
  /**
    The namespace for Ember.SimpleAuth's authenticators.

    @namespace Ember.SimpleAuth.Authenticators
    @static
  **/
  Authenticators: Ember.Namespace.create(),
  /**
    The namespace for Ember.SimpleAuth's authorizers.

    @namespace Ember.SimpleAuth.Authorizers
    @static
  **/
  Authorizers: Ember.Namespace.create(),
  /**
    The namespace for Ember.SimpleAuth's stores.

    @namespace Ember.SimpleAuth.Stores
    @static
  **/
  Stores: Ember.Namespace.create(),

  /**
    The route to redirect the user to after successfully logging in. This is
    set by Ember.SimpleAuth#setup.

    @property routeAfterLogin
    @readOnly
    @type String
    @default 'index'
  */
  routeAfterLogin: null,
  /**
    The route to redirect the user to after successfully logging out. This is
    set by Ember.SimpleAuth#setup.

    @property routeAfterLogout
    @readOnly
    @type String
    @default 'index'
  */
  routeAfterLogout: null,
  /**
    The route to redirect the user to to log in. This is set by
    Ember.SimpleAuth#setup.

    @property loginRoute
    @readOnly
    @type String
    @default 'login'
  */
  loginRoute: null,

  /**
    Sets up Ember.SimpleAuth for the application; this method should be invoked in a custom
    initializer like this:

    ```javascript
    Ember.Application.initializer({
      name: 'authentication',
      initialize: function(container, application) {
        Ember.SimpleAuth.setup(application);
      }
    });
    ```

    @method setup
    @static
    @param {Ember.Application} application The Ember.js application instance
    @param {Object} [options]
      @param {String} [options.routeAfterLogin] route to redirect the user to after successfully logging in - defaults to `'index'`
      @param {String} [options.routeAfterLogout] route to redirect the user to after logging out - defaults to `'index'`
      @param {String} [options.loginRoute] route to redirect the user to when login is required - defaults to `'login'`
      @param {Array[String]} [options.crossOriginWhitelist] Ember.SimpleAuth will never authorize requests going to a different origin than the one the Ember.js app was loaded from; to explicitely enabled authorization for additional origins, whitelist those origins - defaults to `[]` (beware that origins consist of protocol, host and port (port can be left out when it is 80))
      @param {Object} [options.authorizer] The authorizer "class" to use; must extend `Ember.SimpleAuth.Authorizers.Base` - defaults to `Ember.SimpleAuth.Authorizers.OAuth2`
      @param {Object} [options.store] The store "class" to use; must extend `Ember.SimpleAuth.Stores.Base` - defaults to `Ember.SimpleAuth.Stores.Cookie`
  **/
  setup: function(application, options) {
    options                    = options || {};
    this.routeAfterLogin       = options.routeAfterLogin || 'index';
    this.routeAfterLogout      = options.routeAfterLogout || 'index';
    this.loginRoute            = options.loginRoute || 'login';
    this._crossOriginWhitelist = Ember.A(options.crossOriginWhitelist || []);

    var store      = (options.store || Ember.SimpleAuth.Stores.Cookie).create();
    var session    = Ember.SimpleAuth.Session.create({ store: store });
    var authorizer = (options.authorizer || Ember.SimpleAuth.Authorizers.OAuth2).create({ session: session });

    application.register('ember-simple-auth:session:current', session, { instantiate: false, singleton: true });
    Ember.A(['model', 'controller', 'view', 'route']).forEach(function(component) {
      application.inject(component, 'session', 'ember-simple-auth:session:current');
    });

    Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
      if (Ember.SimpleAuth.shouldAuthorizeRequest(options.url)) {
        authorizer.authorize(jqXHR, options);
      }
    });
  },

  /**
    @method shouldAuthorizeRequest
    @private
    @static
  */
  shouldAuthorizeRequest: function(url) {
    this._linkOrigins    = this._linkOrigins || {};
    this._documentOrigin = this._documentOrigin || extractLocationOrigin(window.location);
    var link = this._linkOrigins[url] || function() {
      var link = document.createElement('a');
      link.href = url;
      return (this._linkOrigins[url] = link);
    }.apply(this);
    var linkOrigin = extractLocationOrigin(link);
    return this._crossOriginWhitelist.indexOf(linkOrigin) > -1 || linkOrigin === this._documentOrigin;
  }
});
