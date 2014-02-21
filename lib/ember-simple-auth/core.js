var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import { Session } from './session';
import { Authenticators } from './authenticators';
import { Authorizers } from './authorizers';
import { Stores } from './stores';

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

var Core = Ember.Namespace.create({
  /**
    The route to transition to for authentication; can be set through
    [EmberSimpleAuth.setup](#Ember-SimpleAuth-setup).

    @property authenticationRoute
    @readOnly
    @static
    @type String
    @default 'login'
  */
  authenticationRoute: 'login',
  /**
    The route to transition to after successful authentication; can be set
    through [EmberSimpleAuth.setup](#Ember-SimpleAuth-setup).

    @property routeAfterAuthentication
    @readOnly
    @static
    @type String
    @default 'index'
  */
  routeAfterAuthentication: 'index',
  /**
    The route to transition to after session invalidation; can be set through
    [EmberSimpleAuth.setup](#Ember-SimpleAuth-setup).

    @property routeAfterInvalidation
    @readOnly
    @static
    @type String
    @default 'index'
  */
  routeAfterInvalidation: 'index',

  /**
    Sets up EmberSimpleAuth for the application; this method __should be invoked in a custom
    initializer__ like this:

    ```javascript
    Ember.Application.initializer({
      name: 'authentication',
      initialize: function(container, application) {
        EmberSimpleAuth.setup(container, application);
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
      @param {Array[String]} [options.crossOriginWhitelist] EmberSimpleAuth will never authorize requests going to a different origin than the one the Ember.js application was loaded from; to explicitely enable authorization for additional origins, whitelist those origins - defaults to `[]` _(beware that origins consist of protocol, host and port (port can be left out when it is 80))_
      @param {Object} [options.authorizer] The authorizer _class_ to use; must extend `EmberSimpleAuth.Authorizers.Base` - defaults to `EmberSimpleAuth.Authorizers.OAuth2`
      @param {Object} [options.store] The store _class_ to use; must extend `EmberSimpleAuth.Stores.Base` - defaults to `EmberSimpleAuth.Stores.LocalStorage`
  **/
  setup: function(container, application, options) {
    options                       = options || {};
    this.routeAfterAuthentication = options.routeAfterAuthentication || this.routeAfterAuthentication;
    this.routeAfterInvalidation   = options.routeAfterInvalidation || this.routeAfterInvalidation;
    this.authenticationRoute      = options.authenticationRoute || this.authenticationRoute;
    this._crossOriginWhitelist    = Ember.A(options.crossOriginWhitelist || []).map(function(origin) {
      return extractLocationOrigin(origin);
    });

    container.register('ember-simple-auth:authenticators:oauth2', Authenticators.OAuth2);

    var store      = (options.store || Stores.LocalStorage).create();
    var session    = Session.create({ store: store, container: container });
    var authorizer = (options.authorizer || Authorizers.OAuth2).create({ session: session });

    container.register('ember-simple-auth:session:current', session, { instantiate: false });
    Ember.A(['model', 'controller', 'view', 'route']).forEach(function(component) {
      container.injection(component, 'session', 'ember-simple-auth:session:current');
    });

    Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
      if (Core.shouldAuthorizeRequest(options.url)) {
        authorizer.authorize(jqXHR, options);
      }
    });
  },

  shouldAuthorizeRequest: function(url) {
    this._urlOrigins     = this._urlOrigins || {};
    this._documentOrigin = this._documentOrigin || extractLocationOrigin(window.location);
    var urlOrigin        = this._urlOrigins[url] = this._urlOrigins[url] || extractLocationOrigin(url);
    return this._crossOriginWhitelist.indexOf(urlOrigin) > -1 || urlOrigin === this._documentOrigin;
  }
});

export { Core };