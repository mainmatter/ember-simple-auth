'use strict';

function extractLocationOrigin(location) {
  if (Ember.typeOf(location) === 'string') {
    var link = document.createElement('a');
    link.href = location;
    //IE requires the following line when url is relative.
    //First assignment of relative url to link.href results in absolute url on link.href but link.hostname and other properties are not set
    //Second assignment of absolute url to link.href results in link.hostname and other properties being set as expected
    link.href = link.href;
    location = link;
  }
  var port = location.port;
  if (Ember.isEmpty(port)) {
    //need to include the port whether its actually present or not as some versions of IE will always set it
    port = location.protocol === 'http:' ? '80' : (location.protocol === 'https:' ? '443' : '');
  }
  return location.protocol + '//' + location.hostname + (port !== '' ? ':' + port : '');
}

/**
  The main namespace for Ember.SimpleAuth.

  __For a general overview of how Ember.SimpleAuth works, see the
  [README](https://github.com/simplabs/ember-simple-auth#readme).__

  @class SimpleAuth
  @namespace Ember
**/
Ember.SimpleAuth = Ember.Namespace.create({
  Authenticators: Ember.Namespace.create(),
  Authorizers:    Ember.Namespace.create(),
  Stores:         Ember.Namespace.create(),

  /**
    The route to transition to for authentication; can be set through
    [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

    @property authenticationRoute
    @readOnly
    @static
    @type String
    @default 'login'
  */
  authenticationRoute: 'login',
  /**
    The route to transition to after successful authentication; can be set
    through [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

    @property routeAfterAuthentication
    @readOnly
    @static
    @type String
    @default 'index'
  */
  routeAfterAuthentication: 'index',
  /**
    The route to transition to after session invalidation; can be set through
    [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

    @property routeAfterInvalidation
    @readOnly
    @static
    @type String
    @default 'index'
  */
  routeAfterInvalidation: 'index',

  /**
    Sets up Ember.SimpleAuth for the application; this method __should be invoked in a custom
    initializer__ like this:

    ```javascript
    Ember.Application.initializer({
      name: 'authentication',
      initialize: function(container, application) {
        Ember.SimpleAuth.setup(container, application);
      }
    });
    ```

    @method setup
    @static
    @param {Container} container The Ember.js application's dependency injection container
    @param {Ember.Application} application The Ember.js application instance
    @param {Object} [options]
      @param {String} [options.authenticationRoute] route to transition to for authentication - defaults to `'login'`
      @param {String} [options.routeAfterAuthentication] route to transition to after successful authentication - defaults to `'index'`
      @param {String} [options.routeAfterInvalidation] route to transition to after session invalidation - defaults to `'index'`
      @param {Array[String]} [options.crossOriginWhitelist] Ember.SimpleAuth will never authorize requests going to a different origin than the one the Ember.js application was loaded from; to explicitely enable authorization for additional origins, whitelist those origins - defaults to `[]` _(beware that origins consist of protocol, host and port (port can be left out when it is 80))_
      @param {Object} [options.authorizer] The authorizer _class_ to use; must extend `Ember.SimpleAuth.Authorizers.Base` - defaults to `Ember.SimpleAuth.Authorizers.OAuth2`
      @param {Object} [options.store] The store _class_ to use; must extend `Ember.SimpleAuth.Stores.Base` - defaults to `Ember.SimpleAuth.Stores.LocalStorage`
  **/
  setup: function(container, application, options) {
    options                       = options || {};
    this.routeAfterAuthentication = options.routeAfterAuthentication || this.routeAfterAuthentication;
    this.routeAfterInvalidation   = options.routeAfterInvalidation || this.routeAfterInvalidation;
    this.authenticationRoute      = options.authenticationRoute || this.authenticationRoute;
    this._crossOriginWhitelist    = Ember.A(options.crossOriginWhitelist || []).map(function(origin) {
      return extractLocationOrigin(origin);
    });

    container.register('ember-simple-auth:authenticators:oauth2', Ember.SimpleAuth.Authenticators.OAuth2);
    container.register('ember-simple-auth:authenticators:devise', Ember.SimpleAuth.Authenticators.Devise);

    var store      = (options.store || Ember.SimpleAuth.Stores.LocalStorage).create();
    var session    = Ember.SimpleAuth.Session.create({ store: store, container: container });
    var authorizer = (options.authorizer || Ember.SimpleAuth.Authorizers.OAuth2).create({ session: session });

    container.register('ember-simple-auth:session:current', session, { instantiate: false });
    Ember.A(['model', 'controller', 'view', 'route']).forEach(function(component) {
      container.injection(component, 'session', 'ember-simple-auth:session:current');
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
    this._urlOrigins     = this._urlOrigins || {};
    this._documentOrigin = this._documentOrigin || extractLocationOrigin(window.location);
    var urlOrigin        = this._urlOrigins[url] = this._urlOrigins[url] || extractLocationOrigin(url);
    return this._crossOriginWhitelist.indexOf(urlOrigin) > -1 || urlOrigin === this._documentOrigin;
  }
});
