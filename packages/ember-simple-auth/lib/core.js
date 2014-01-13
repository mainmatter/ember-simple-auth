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
    The namespace for Ember.SimpleAuth's authenticator strategies.

    @namespace Ember.SimpleAuth.Authenticators
    @static
  **/
  Authenticators: Ember.Namespace.create(),
  /**
    The namespace for Ember.SimpleAuth's authorizer strategies.

    @namespace Ember.SimpleAuth.Authorizers
    @static
  **/
  Authorizers: Ember.Namespace.create(),
  /**
    The namespace for Ember.SimpleAuth's store strategies.

    @namespace Ember.SimpleAuth.Stores
    @static
  **/
  Stores: Ember.Namespace.create(),

  /**
    The route to redirect the user to after successfully authenticating. This
    is set by Ember.SimpleAuth#setup.

    @property routeAfterAuthentication
    @readOnly
    @static
    @type String
    @default 'index'
  */
  routeAfterAuthentication: 'index',
  /**
    The route to redirect the user to after session invalidation. This is set
    by Ember.SimpleAuth#setup.

    @property routeAfterInvalidation
    @readOnly
    @static
    @type String
    @default 'index'
  */
  routeAfterInvalidation: 'index',
  /**
    The route to redirect the user to for authentication. This is set by
    Ember.SimpleAuth#setup.

    @property authenticationRoute
    @readOnly
    @static
    @type String
    @default 'login'
  */
  authenticationRoute: 'login',

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
      @param {String} [options.routeAfterAuthentication] route to redirect the user to after successful authentication - defaults to `'index'`
      @param {String} [options.routeAfterInvalidation] route to redirect the user to after session invalidation - defaults to `'index'`
      @param {String} [options.authenticationRoute] route to redirect the user to for authentication - defaults to `'login'`
      @param {Array[String]} [options.crossOriginWhitelist] Ember.SimpleAuth will never authorize requests going to a different origin than the one the Ember.js application was loaded from; to explicitely enable authorization for additional origins, whitelist those origins - defaults to `[]` (beware that origins consist of protocol, host and port (port can be left out when it is 80))
      @param {Object} [options.authorizer] The authorizer "class" to use; must extend `Ember.SimpleAuth.Authorizers.Base` - defaults to `Ember.SimpleAuth.Authorizers.OAuth2`
      @param {Object} [options.store] The store "class" to use; must extend `Ember.SimpleAuth.Stores.Base` - defaults to `Ember.SimpleAuth.Stores.Cookie`
  **/
  setup: function(application, options) {
    options                       = options || {};
    this.routeAfterAuthentication = options.routeAfterAuthentication || this.routeAfterAuthentication;
    this.routeAfterInvalidation   = options.routeAfterInvalidation || this.routeAfterInvalidation;
    this.authenticationRoute      = options.authenticationRoute || this.authenticationRoute;
    this._crossOriginWhitelist    = Ember.A(options.crossOriginWhitelist || []);

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
