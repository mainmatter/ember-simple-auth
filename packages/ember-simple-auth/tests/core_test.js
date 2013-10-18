var applicationMock;
var ApplicationMock = Ember.Object.extend({
  init: function() {
    this._super();
    this.registrations = {};
    this.injections = [];
  },
  register: function(name, factory, options) {
    this.registrations[name] = {
      factory: factory,
      options: options
    };
  },
  inject: function(target, property, name) {
    var registration = this.registrations[name];
    if (registration) {
      this.injections.push({
        target:   target,
        property: property,
        object:   registration.factory
      });
    }
  }
});

var applicationRouteMock;
var ApplicationRouteMock = Ember.Object.extend({
  init: function() {
    this._super();
    this.invokedloginSucceeded = false;
    this.invokedLoginFailed    = false;
  },
  send: function(name) {
    this.invokedLoginSucceeded = (name === 'loginSucceeded');
    this.invokedLoginFailed    = (name === 'loginFailed');
  }
});

var containerMock;
var ContainerMock = Ember.Object.extend({
  lookup: function(name) {
    return applicationRouteMock;
  }
});

var XhrMock = Ember.Object.extend({
  init: function() {
    this._super();
    this.requestHeaders = {};
  },
  setRequestHeader: function(name, value) {
    this.requestHeaders[name] = value;
  }
});

var registeredAjaxPrefilter;
var ajaxPrefilterMock = function(prefilter) {
  registeredAjaxPrefilter = prefilter;
};

module('Ember.SimpleAuth', {
  originalAjaxPrefilter: Ember.$.ajaxPrefilter,
  setup: function() {
    Ember.$.ajaxPrefilter   = ajaxPrefilterMock;
    registeredAjaxPrefilter = undefined;
    applicationMock         = ApplicationMock.create();
    applicationRouteMock    = ApplicationRouteMock.create();
    containerMock           = ContainerMock.create();
  },
  teardown: function() {
    Ember.$.ajaxPrefilter = this.originalAjaxPrefilter;
  }
});

test('saves the server session route when specified for setup', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock, { serverSessionRoute: '/route' });

  equal(Ember.SimpleAuth.serverSessionRoute, '/route', 'Ember.SimpleAuth saves serverSessionRoute when specified for setup.');
});

test('saves the route after login when specified for setup', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock, { routeAfterLogin: 'somewhere' });

  equal(Ember.SimpleAuth.routeAfterLogin, 'somewhere', 'Ember.SimpleAuth saves routeAfterLogin when specified for setup.');
});

test('saves the route after logout when specified for setup', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock, { routeAfterLogout: 'somewhere' });

  equal(Ember.SimpleAuth.routeAfterLogout, 'somewhere', 'Ember.SimpleAuth saves routeAfterLogout when specified for setup.');
});

test('saves the login route when specified for setup', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock, { loginRoute: 'somewhere' });

  equal(Ember.SimpleAuth.loginRoute, 'somewhere', 'Ember.SimpleAuth saves loginRoute when specified for setup.');
});

test('injects a session object in models, views, controllers and routes during setup', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock);

  Ember.$.each(['model', 'view', 'controller', 'view'], function(i, component) {
    var injection = Ember.$.grep(applicationMock.injections, function(injection) {
      return injection.target === component;
    })[0];

    equal(injection.property, 'session', 'Ember.SimpleAuth injects makes a session object available as "session" in ' + component + ' during setup.');
    equal(injection.object.constructor, Ember.SimpleAuth.Session, 'Ember.SimpleAuth injects a session object into ' + component + ' during setup.');
  });
});

test('registers an AJAX prefilter that adds the authToken for non-crossdomain requests during setup', function() {
  var xhrMock = XhrMock.create();
  var token = Math.random().toString(36);
  sessionStorage.authToken = token;
  Ember.SimpleAuth.setup(containerMock, applicationMock);

  registeredAjaxPrefilter({}, {}, xhrMock);
  equal(xhrMock.requestHeaders['Authorization'], 'Token token="' + token + '"', 'Ember.SimpleAuth registers an AJAX prefilter that adds the authToken for non-crossdomain requests during setup.');

  xhrMock = XhrMock.create();
  xhrMock.crossDomain = true;
  registeredAjaxPrefilter({}, {}, xhrMock);
  equal(xhrMock.requestHeaders['Authorization'], undefined, 'Ember.SimpleAuth registers an AJAX prefilter that does not add the authToken for crossdomain requests during setup.');
});

test('sets up the session correctly in the external login succeeded callback', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock);
  var token = Math.random().toString(36);
  Ember.SimpleAuth.externalLoginSucceededCallback({ session: { authToken: token } });

  equal(applicationMock.registrations['simple_auth:session'].factory.get('authToken'), token, 'Ember.SimpleAuth sets up the session with the auth token in the external login callback.');
});

test('invokes the correct action in the external login succeeded callback', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock);
  Ember.SimpleAuth.externalLoginSucceededCallback({ session: { authToken: 'token' } });

  ok(applicationRouteMock.invokedLoginSucceeded, 'Ember.SimpleAuth invokes the loginSucceeded action on the application route in externalLoginSucceededCallback.');
});

test('invokes the correct action in the external login failed callback', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock);
  Ember.SimpleAuth.externalLoginFailedCallback();

  ok(applicationRouteMock.invokedLoginFailed, 'Ember.SimpleAuth invokes the loginFailed action on the application route in externalLoginFailedCallback.');
});
