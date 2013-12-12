'use strict';

function locationOrigin(location) {
  return location.protocol + '//' + location.hostname + (location.port !== '' ? ':' + location.port : '');
}

/**
  The main namespace for Ember.SimpleAuth

  @class SimpleAuth
  @namespace Ember
  @static
**/
Ember.SimpleAuth = Ember.Namespace.create();

/**
  Sets up Ember.SimpleAuth for your application; invoke this method in a custom
  initializer like this:

  ```javascript
  Ember.Application.initializer({
    name: 'authentication',
    initialize: function(application) {
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
    @param {Array[String]} [options.crossOriginWhitelist] list of origins that (besides the origin of the Ember.js application) send the authentication token to - defaults to `[]` (beware that origins consist of protocol, host and port (you can leave port out when it is 80))
    @param {Object} [options.authorizer] The authorizer "class" to use; must extend `Ember.Object` and also implement `function(jqXHR, requestOptions)` - defaults to `Ember.SimpleAuth.Authorizers.OAuth2`
    @param {Object} [options.store] The store "class" to use; must extend `Ember.Object` and also implement `function(jqXHR, requestOptions)` - defaults to `Ember.SimpleAuth.Stores.Cookie`
**/
Ember.SimpleAuth.setup = function(application, options) {
  options = options || {};
  this.routeAfterLogin  = options.routeAfterLogin || 'index';
  this.routeAfterLogout = options.routeAfterLogout || 'index';
  this.loginRoute       = options.loginRoute || 'login';

  var store      = (options.store || Ember.SimpleAuth.Stores.Cookie).create();
  var session    = Ember.SimpleAuth.Session.create({ store: store });
  var authorizer = (options.authorizer || Ember.SimpleAuth.Authorizers.OAuth2).create({ session: session });

  application.register('simple_auth:session', session, { instantiate: false, singleton: true });
  Ember.A(['model', 'controller', 'view', 'route']).forEach(function(component) {
    application.inject(component, 'session', 'simple_auth:session');
  });

  Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    if (shouldAuthorizeRequest(options.url)) {
      authorizer.authorize(jqXHR, options);
    }
  });

  var crossOriginWhitelist = Ember.A(options.crossOriginWhitelist || []);
  var linkOrigins          = {};
  var documentOrigin       = locationOrigin(window.location);
  function shouldAuthorizeRequest(url) {
    var link = linkOrigins[url] || function() {
      var link = document.createElement('a');
      link.href = url;
      return (linkOrigins[url] = link);
    }();
    var linkOrigin = locationOrigin(link);
    return crossOriginWhitelist.indexOf(linkOrigin) > -1 || linkOrigin === documentOrigin;
  }
};
