import Configuration from './configuration';
import Session from './session';
import LocalStorage from './stores/local_storage';
import Ephemeral from './stores/ephemeral';
import initializeExtension from './initialize_extension';

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
var crossOriginWhitelist;
function shouldAuthorizeRequest(url, options) {
  if (options.crossDomain === false) {
    return true;
  }
  var urlOrigin = urlOrigins[url] = urlOrigins[url] || extractLocationOrigin(url);
  return crossOriginWhitelist.indexOf(urlOrigin) > -1;
}

function registerStores(container) {
  container.register('ember-simple-auth-session-store:local-storage', LocalStorage);
  container.register('ember-simple-auth-session-store:ephemeral', Ephemeral);
}

/**
  Sets up Ember.SimpleAuth for the application; this method __should be invoked
  in a custom initializer__ like this:

  ```javascript
  Ember.Application.initializer({
    name: 'authentication',
    initialize: function(container, application) {
      Ember.SimpleAuth.setup(container, application);
    }
  });
  ```

  @method setup
  @namespace $mainModule
  @static
  @param {Container} container The Ember.js application's dependency injection container
  @param {Ember.Application} application The Ember.js application instance
  @param {Object} options
    @param {String} [options.authorizerFactory] The authorizer factory to use as it is registered with Ember's container, see [Ember's API docs](http://emberjs.com/api/classes/Ember.Application.html#method_register); when the application does not interact with a server that requires authorized requests, no auzthorizer is needed
    @param {Object} [options.storeFactory] The store factory to use as it is registered with Ember's container, see [Ember's API docs](http://emberjs.com/api/classes/Ember.Application.html#method_register) - defaults to `session-stores:local-storage`
    @param {Object} [options.sessionPropertyName] The name for the property that the session is injected with into routes and controllers - defaults to `session`
    @param {String} [options.authenticationRoute] route to transition to for authentication - defaults to `'login'`
    @param {String} [options.routeAfterAuthentication] route to transition to after successful authentication - defaults to `'index'`
    @param {Array[String]} [options.crossOriginWhitelist] Ember.SimpleAuth will never authorize requests going to a different origin than the one the Ember.js application was loaded from; to explicitely enable authorization for additional origins, whitelist those origins - defaults to `[]` _(beware that origins consist of protocol, host and port (port can be left out when it is 80 for HTTP or 443 for HTTPS))_
**/
export default function(container, application, options) {
  application.deferReadiness();
  registerStores(container);
  Configuration.extensionInitializers.forEach(function(initializer) {
    initializer(container, application, options);
  });

  options                                = options || {};
  Configuration.routeAfterAuthentication = options.routeAfterAuthentication || Configuration.routeAfterAuthentication;
  Configuration.authenticationRoute      = options.authenticationRoute || Configuration.authenticationRoute;
  Configuration.sessionPropertyName      = options.sessionPropertyName || Configuration.sessionPropertyName;
  Configuration.applicationRootUrl       = container.lookup('router:main').get('rootURL') || '/';
  crossOriginWhitelist                   = Ember.A(options.crossOriginWhitelist || []).map(function(origin) {
    return extractLocationOrigin(origin);
  });

  options.storeFactory = options.storeFactory || 'ember-simple-auth-session-store:local-storage';
  var store            = container.lookup(options.storeFactory);
  var session          = Session.create({ store: store, container: container });

  container.register('ember-simple-auth-session:main', session, { instantiate: false });
  Ember.A(['controller', 'route']).forEach(function(component) {
    container.injection(component, Configuration.sessionPropertyName, 'ember-simple-auth-session:main');
  });

  if (!Ember.isEmpty(options.authorizerFactory)) {
    var authorizer = container.lookup(options.authorizerFactory);
    if (!!authorizer) {
      authorizer.set('session', session);
      Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
        if (shouldAuthorizeRequest(options.url, options)) {
          authorizer.authorize(jqXHR, options);
        }
      });
      Ember.$(document).ajaxError(function(event, jqXHR, setting, exception) {
        if (jqXHR.status === 401) {
          session.trigger('authorizationFailed');
        }
      });
    }
  } else {
    Ember.Logger.debug('No authorizer factory was specified for Ember.SimpleAuth - specify one if backend requests need to be authorized.');
  }

  var advanceReadiness = function() {
    application.advanceReadiness();
  };
  session.restore().then(advanceReadiness, advanceReadiness);
}
