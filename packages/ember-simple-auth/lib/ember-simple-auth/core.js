import { Session } from './session';
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

var urlOrigins     = {};
var documentOrigin = extractLocationOrigin(window.location);
var crossOriginWhitelist;
function shouldAuthorizeRequest(url) {
  var urlOrigin = urlOrigins[url] = urlOrigins[url] || extractLocationOrigin(url);
  return crossOriginWhitelist.indexOf(urlOrigin) > -1 || urlOrigin === documentOrigin;
}

var extensionInitializers = [];

/**
  Ember.SimpleAuth's configuration object.

  @class Configuration
  @namespace $mainModule
*/
var Configuration = {
  /**
    The route to transition to for authentication; should be set through
    [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

    @property authenticationRoute
    @readOnly
    @static
    @type String
    @default 'login'
  */
  authenticationRoute: 'login',

  /**
    The route to transition to after successful authentication; should be set
    through [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

    @property routeAfterAuthentication
    @readOnly
    @static
    @type String
    @default 'index'
  */
  routeAfterAuthentication: 'index',

  /**
    @property applicationRootUrl
    @static
    @private
    @type String
  */
  applicationRootUrl: null,
};

/**
  Sets up Ember.SimpleAuth for the application; this method __should be invoked
  in a custom initializer__ like this:

  ```javascript
  Ember.Application.initializer({
    name: 'authentication',
    initialize: function(container, application) {
      Ember.SimpleAuth.setup(container, application, 'authorizerFactory');
    }
  });
  ```

  @method setup
  @namespace $mainModule
  @static
  @param {Container} container The Ember.js application's dependency injection container
  @param {Ember.Application} application The Ember.js application instance
  @param {Object} options
    @param {String} [options.authorizerFactory] The authorizer factory to use as it is registered with Ember's container, see [Ember's API docs](http://emberjs.com/api/classes/Ember.Application.html#method_register)
    @param {String} [options.authenticationRoute] route to transition to for authentication - defaults to `'login'`
    @param {String} [options.routeAfterAuthentication] route to transition to after successful authentication - defaults to `'index'`
    @param {Array[String]} [options.crossOriginWhitelist] Ember.SimpleAuth will never authorize requests going to a different origin than the one the Ember.js application was loaded from; to explicitely enable authorization for additional origins, whitelist those origins - defaults to `[]` _(beware that origins consist of protocol, host and port (port can be left out when it is 80 for HTTP or 443 for HTTPS))_
    @param {Object} [options.store] The store _class_ to use; must extend `Ember.SimpleAuth.Stores.Base` - defaults to `Ember.SimpleAuth.Stores.LocalStorage`
**/
var setup = function(container, application, options) {
  extensionInitializers.forEach(function(initializer) {
    initializer(container, application, options);
  });

  options                                = options || {};
  Configuration.routeAfterAuthentication = options.routeAfterAuthentication || Configuration.routeAfterAuthentication;
  Configuration.authenticationRoute      = options.authenticationRoute || Configuration.authenticationRoute;
  Configuration.applicationRootUrl       = container.lookup('router:main').get('rootURL') || '/';
  crossOriginWhitelist                   = Ember.A(options.crossOriginWhitelist || []).map(function(origin) {
    return extractLocationOrigin(origin);
  });

  var store   = (options.store || Stores.LocalStorage).create();
  var session = Session.create({ store: store, container: container });

  container.register('ember-simple-auth:session:current', session, { instantiate: false });
  Ember.A(['model', 'controller', 'view', 'route']).forEach(function(component) {
    container.injection(component, 'session', 'ember-simple-auth:session:current');
  });

  if (!Ember.isEmpty(options.authorizerFactory)) {
    var authorizer = container.lookup(options.authorizerFactory);
    if (!!authorizer) {
      authorizer.set('session', session);
      Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
        if (shouldAuthorizeRequest(options.url)) {
          authorizer.authorize(jqXHR, options);
        }
      });
    }
  } else {
    Ember.Logger.debug('No authorizer factory was specified for Ember.SimpleAuth - specify one if backend requests need to be authorized.');
  }
};

/**
  Registers an extension initializer to be invoked when
  [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup) is invoked. __This is used
  by extensions__ to the base Ember.SimpleAuth library that can e.g. register
  factories with the Ember.js Dependency Injection container here etc.

  @method initializeExtension
  @namespace $mainModule
  @static
  @param {Function} initializer The initializer to be invoked when [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup) is invoked; this will receive the same arguments as [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).
*/
var initializeExtension = function(initializer) {
  extensionInitializers.push(initializer);
};

export { setup, initializeExtension, Configuration };
