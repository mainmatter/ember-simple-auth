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
    this.sentLoginComplete = false;
  },
  send: function(name) {
    this.sentLoginComplete = name == 'loginComplete';
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

test('saves serverSessionRoute if specified for setup', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock, { serverSessionRoute: '/route' });

  equal(Ember.SimpleAuth.serverSessionRoute, '/route', 'Ember.SimpleAuth saves serverSessionRoute when specified for setup.');
});

test('saves routeAfterLogin if specified for setup', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock, { routeAfterLogin: 'somewhere' });

  equal(Ember.SimpleAuth.routeAfterLogin, 'somewhere', 'Ember.SimpleAuth saves routeAfterLogin when specified for setup.');
});

test('saves routeAfterLogout if specified for setup', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock, { routeAfterLogout: 'somewhere' });

  equal(Ember.SimpleAuth.routeAfterLogout, 'somewhere', 'Ember.SimpleAuth saves routeAfterLogout when specified for setup.');
});

test('saves loginRoute if specified for setup', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock, { loginRoute: 'somewhere' });

  equal(Ember.SimpleAuth.loginRoute, 'somewhere', 'Ember.SimpleAuth saves loginRoute when specified for setup.');
});

test('saves logoutRoute if specified for setup', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock, { logoutRoute: 'somewhere' });

  equal(Ember.SimpleAuth.logoutRoute, 'somewhere', 'Ember.SimpleAuth saves logutRoute when specified for setup.');
});

test('injects a session object in models, views, controllers and routes during setup', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock);

  Ember.$.each(['model', 'view', 'controller', 'view'], function(i, component) {
    var injection = Ember.$.grep(applicationMock.injections, function(injection) {
      return injection.target === component;
    })[0];

    equal(injection.property, 'session', 'Ember.SimpleAuth injects a session into ' + component + ' during setup.');
    equal(injection.object.constructor, Ember.SimpleAuth.Session, 'Ember.SimpleAuth.setup injects a session into ' + component + ' during setup.');
  });
});

test('registers an AJAX prefilter that adds the authToken for non-crossdomain requests during setup', function() {
  var xhrMock = XhrMock.create();
  var token = Math.random().toString(36);
  sessionStorage.authToken = token;
  Ember.SimpleAuth.setup(containerMock, applicationMock);

  registeredAjaxPrefilter({}, {}, xhrMock);
  equal(xhrMock.requestHeaders['Authorization'], 'Token token="' + token + '"', 'Ember.SimpleAuth.setup registers an AJAX prefilter that adds the authToken for non-crossdomain requests during setup.');

  xhrMock = XhrMock.create();
  xhrMock.crossDomain = true;
  registeredAjaxPrefilter({}, {}, xhrMock);
  equal(xhrMock.requestHeaders['Authorization'], undefined, 'Ember.SimpleAuth.setup registers an AJAX prefilter that does not add the authToken for crossdomain requests during setup.');
});

test('sets up the session correctly in the external login callback', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock);
  var token = Math.random().toString(36);
  Ember.SimpleAuth.externalLoginCallback({ session: { authToken: token } });

  equal(applicationMock.registrations['simple_auth:session'].factory.get('authToken'), token, 'Ember.SimpleAuth sets up the session with the auth token in the external login callback.');
  ok(applicationRouteMock.sentLoginComplete, 'Ember.SimpleAuth sends the loginComplete event to the application routes in the external login callback.');
});
