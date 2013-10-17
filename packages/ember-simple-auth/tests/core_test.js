var ApplicationMock = Ember.Object.extend({
  init: function() {
    this._super();
    this.registrations = [];
    this.injections = [];
  },
  register: function(name, factory, options) {
    this.registrations.push({
      name:    name,
      factory: factory,
      options: options
    });
  },
  inject: function(target, property, name) {
    var registration = Ember.$.grep(this.registrations, function(registration, i) {
      return registration.name === name;
    })[0];
    if (registration) {
      this.injections.push({
        target:   target,
        property: property,
        object:   registration.factory
      });
    }
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
    Ember.$.ajaxPrefilter = ajaxPrefilterMock;
  },
  teardown: function() {
    Ember.$.ajaxPrefilter = this.originalAjaxPrefilter;
  }
});

test('saves serverSessionRoute if specified', function() {
  Ember.SimpleAuth.setup(ApplicationMock.create(), { serverSessionRoute: '/route' });

  equal(Ember.SimpleAuth.serverSessionRoute, '/route', 'Ember.SimpleAuth saves serverSessionRoute when specified.');
});

test('saves routeAfterLogin if specified', function() {
  Ember.SimpleAuth.setup(ApplicationMock.create(), { routeAfterLogin: 'somewhere' });

  equal(Ember.SimpleAuth.routeAfterLogin, 'somewhere', 'Ember.SimpleAuth saves routeAfterLogin when specified.');
});

test('saves routeAfterLogout if specified', function() {
  Ember.SimpleAuth.setup(ApplicationMock.create(), { routeAfterLogout: 'somewhere' });

  equal(Ember.SimpleAuth.routeAfterLogout, 'somewhere', 'Ember.SimpleAuth saves routeAfterLogout when specified.');
});

test('injects a session object in models, views, controllers and routes', function() {
  var container = ApplicationMock.create();
  Ember.SimpleAuth.setup(container);

  Ember.$.each(['model', 'view', 'controller', 'view'], function(i, component) {
    var injection = Ember.$.grep(container.injections, function(injection) {
      return injection.target === component;
    })[0];

    equal(injection.property, 'session', 'Ember.SimpleAuth injects a session into ' + component + '.');
    equal(injection.object.constructor, Ember.SimpleAuth.Session, 'Ember.SimpleAuth injects a session into ' + component + '.');
  });
});

test('registers an AJAX prefilter that adds the authToken for non-crossdomain requests', function() {
  var xhrMock = XhrMock.create();
  var token = Math.random().toString(36);
  sessionStorage.authToken = token;
  Ember.SimpleAuth.setup(ApplicationMock.create());

  registeredAjaxPrefilter({}, {}, xhrMock);
  equal(xhrMock.requestHeaders['Authorization'], 'Token token="' + token + '"', 'Ember.SimpleAuth registers an AJAX prefilter that adds the authToken for non-crossdomain requests.');

  xhrMock = XhrMock.create();
  xhrMock.crossDomain = true;
  registeredAjaxPrefilter({}, {}, xhrMock);
  equal(xhrMock.requestHeaders['Authorization'], undefined, 'Ember.SimpleAuth registers an AJAX prefilter that does not add the authToken for crossdomain requests.');
});
