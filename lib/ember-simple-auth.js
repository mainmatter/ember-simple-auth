import { Session } from './ember-simple-auth/session';
import { Authenticators } from './ember-simple-auth/authenticartors';
import { Authorizers } from './ember-simple-auth/authorizers';
import { Stores } from './ember-simple-auth/stores';
import { ApplicationRouteMixin } from './ember-simple-auth/mixins/application_route_mixin';
import { AuthenticatedRouteMixin } from './ember-simple-auth/mixins/authenticated_route_mixin';
import { AuthenticationControllerMixin } from './ember-simple-auth/mixins/authentication_controller_mixin';
import { LoginControllerMixin } from './ember-simple-auth/mixins/login_controller_mixin';

var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

function extractLocationOrigin(location) {
  return location.protocol + '//' + location.hostname + (location.port !== '' ? ':' + location.port : '');
}

/**
  The main namespace for Ember.SimpleAuth.

  __For a general overview of how Ember.SimpleAuth works, see the
  [README](https://github.com/simplabs/ember-simple-auth#readme).__

  @class SimpleAuth
**/
var SimpleAuth = Ember.Namespace.create({
  Session:                       Session,
  ApplicationRouteMixin:         ApplicationRouteMixin,
  AuthenticatedRouteMixin:       AuthenticatedRouteMixin,
  AuthenticationControllerMixin: AuthenticationControllerMixin,
  LoginControllerMixin:          LoginControllerMixin,
  Authenticators:                Authenticators,
  Authorizers:                   Authorizers,
  Stores:                        Stores,

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
        Ember.SimpleAuth.setup(application);
      }
    });
    ```

    @method setup
    @static
    @param {Ember.Application} application The Ember.js application instance
    @param {Object} [options]
      @param {String} [options.authenticationRoute] route to transition to for authentication - defaults to `'login'`
      @param {String} [options.routeAfterAuthentication] route to transition to after successful authentication - defaults to `'index'`
      @param {String} [options.routeAfterInvalidation] route to transition to after session invalidation - defaults to `'index'`
      @param {Array[String]} [options.crossOriginWhitelist] Ember.SimpleAuth will never authorize requests going to a different origin than the one the Ember.js application was loaded from; to explicitely enable authorization for additional origins, whitelist those origins - defaults to `[]` _(beware that origins consist of protocol, host and port (port can be left out when it is 80))_
      @param {Object} [options.authorizer] The authorizer _class_ to use; must extend `Ember.SimpleAuth.Authorizers.Base` - defaults to `Ember.SimpleAuth.Authorizers.OAuth2`
      @param {Object} [options.store] The store _class_ to use; must extend `Ember.SimpleAuth.Stores.Base` - defaults to `Ember.SimpleAuth.Stores.LocalStorage`
  **/
  setup: function(application, options) {
    options                       = options || {};
    this.routeAfterAuthentication = options.routeAfterAuthentication || this.routeAfterAuthentication;
    this.routeAfterInvalidation   = options.routeAfterInvalidation || this.routeAfterInvalidation;
    this.authenticationRoute      = options.authenticationRoute || this.authenticationRoute;
    this._crossOriginWhitelist    = Ember.A(options.crossOriginWhitelist || []);

    var store      = (options.store || Ember.SimpleAuth.Stores.LocalStorage).create();
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

export { SimpleAuth };
