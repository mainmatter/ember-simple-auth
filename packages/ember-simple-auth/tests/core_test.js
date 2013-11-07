var applicationMock;
var ApplicationMock = Ember.Object.extend({
  init: function() {
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
  send: function(name) {
    this.invokedLoginSucceeded = (name === 'loginSucceeded');
    if (name === 'loginFailed') {
      this.invokedLoginFailed   = true;
      this.loginFailedArguments = arguments;
    }
  }
});

var containerMock = {
  lookup: function(name) {
    return applicationRouteMock;
  }
};

var xhrMock;
var XhrMock = Ember.Object.extend({
  init: function() {
    this.requestHeaders = {};
  },
  setRequestHeader: function(name, value) {
    this.requestHeaders[name] = value;
  }
});

var ajaxPrefilterMock;
var AjaxPrefilterMock = Ember.Object.extend({
  ajaxPrefilterCapture: function(prefilter) {
    this.registeredAjaxPrefilter = prefilter;
  }
});

module('Ember.SimpleAuth', {
  originalAjaxPrefilter: Ember.$.ajaxPrefilter,
  setup: function() {
    document.cookie       = 'authToken=';
    document.cookie       = 'refreshToken=';
    document.cookie       = 'authTokenExpiry=';
    applicationMock       = ApplicationMock.create();
    applicationRouteMock  = ApplicationRouteMock.create();
    ajaxPrefilterMock     = AjaxPrefilterMock.create();
    xhrMock               = XhrMock.create();
    Ember.$.ajaxPrefilter = Ember.$.proxy(ajaxPrefilterMock.ajaxPrefilterCapture, ajaxPrefilterMock);
  },
  teardown: function() {
    Ember.$.ajaxPrefilter = this.originalAjaxPrefilter;
    Ember.run.cancel(Ember.SimpleAuth.Session._SYNC_PROPERTIES_TIMEOUT_);
  }
});

test('saves the server token endpoint when specified for setup', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock, { serverTokenEndpoint: '/endpoint' });

  equal(Ember.SimpleAuth.serverTokenEndpoint, '/endpoint', 'Ember.SimpleAuth saves serverTokenEndpoint when specified for setup.');
});

test('saves the route after login when specified for setup', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock, { routeAfterLogin: 'somewhere' });

  equal(Ember.SimpleAuth.routeAfterLogin, 'somewhere', 'Ember.SimpleAuth saves routeAfterLogin when specified for setup.');
});

test('saves the route after logout when specified for setup', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock, { routeAfterLogout: 'somewhere' });

  equal(Ember.SimpleAuth.routeAfterLogout, 'somewhere', 'Ember.SimpleAuth saves routeAfterLogout when specified for setup.');
});

test('saves the token-auto-refresh-flag when specified for setup', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock, { autoRefreshToken: false });

  ok(!Ember.SimpleAuth.autoRefreshToken, 'Ember.SimpleAuth saves autoRefreshToken when specified for setup.');

  Ember.SimpleAuth.setup(containerMock, applicationMock);

  ok(Ember.SimpleAuth.autoRefreshToken, 'Ember.SimpleAuth defaults autoRefreshToken to true when not specified for setup.');
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
  var token = Math.random().toString(36);
  document.cookie = 'authToken=' + token;
  Ember.SimpleAuth.setup(containerMock, applicationMock);

  ajaxPrefilterMock.registeredAjaxPrefilter({}, {}, xhrMock);
  equal(xhrMock.requestHeaders['Authorization'], 'Bearer ' + token, 'Ember.SimpleAuth registers an AJAX prefilter that adds the authToken for non-crossdomain requests during setup.');

  xhrMock.crossDomain    = true;
  xhrMock.requestHeaders = {};
  ajaxPrefilterMock.registeredAjaxPrefilter({}, {}, xhrMock);
  equal(xhrMock.requestHeaders['Authorization'], undefined, 'Ember.SimpleAuth registers an AJAX prefilter that does not add the authToken for crossdomain requests during setup.');
});

test('sets up the session correctly in the external login succeeded callback', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock);
  var token = Math.random().toString(36);
  Ember.SimpleAuth.externalLoginSucceeded({ access_token: token });

  equal(applicationMock.registrations['simple_auth:session'].factory.get('authToken'), token, 'Ember.SimpleAuth sets up the session with the auth token in externalLoginSucceeded.');
});

test('invokes the correct action in the external login succeeded callback', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock);
  Ember.SimpleAuth.externalLoginSucceeded();

  ok(applicationRouteMock.invokedLoginSucceeded, 'Ember.SimpleAuth invokes the loginSucceeded action on the application route in externalLoginSucceeded.');
});

test('invokes the correct action in the external login failed callback', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock);
  Ember.SimpleAuth.externalLoginFailed({ error: 'error!' });

  ok(applicationRouteMock.invokedLoginFailed, 'Ember.SimpleAuth invokes the loginFailed action on the application route in externalLoginFailed.');
  deepEqual(applicationRouteMock.loginFailedArguments[1], { error: 'error!' }, 'Ember.SimpleAuth invokes the loginFailed action on the application route with the correct arguments in externalLoginSucceeded.');
});
