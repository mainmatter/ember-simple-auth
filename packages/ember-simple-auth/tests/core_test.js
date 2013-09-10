var ContainerMock = Ember.Object.extend({
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

module('Ember.SimpleAuth');

test('saves a baseUrl if specified', function() {
  Ember.SimpleAuth.setup(ContainerMock.create(), { baseUrl: 'base!' });

  equal(Ember.SimpleAuth.baseUrl, 'base!', 'Ember.SimpleAuth saves baseUrl when specified.');
});

test('injects a session object in models, views, controllers and routes', function() {
  var container = ContainerMock.create();
  Ember.SimpleAuth.setup(container);

  Ember.$.each(['model', 'view', 'controller', 'view'], function(i, component) {
    var injection = Ember.$.grep(container.injections, function(injection) {
      return injection.target === component;
    })[0];

    equal(injection.property, 'session', 'Ember.SimpleAuth injects a session into ' + component + '.');
    equal(injection.object.constructor, Ember.SimpleAuth.Session, 'Ember.SimpleAuth injects a session into ' + component + '.');
  });
});

test('registers an AJAX prefilter that adds the authToken for non-crossdomain requests when authenticateAjax is true', function() {
  var originalPrefilter = Ember.$.ajaxPrefilter;
  Ember.$.ajaxPrefilter = ajaxPrefilterMock;
  var xhrMock = XhrMock.create();
  var token = Math.random().toString(36);
  sessionStorage.authToken = token;
  Ember.SimpleAuth.setup(ContainerMock.create(), { authenticateAjax: true });

  registeredAjaxPrefilter({}, {}, xhrMock);
  equal(xhrMock.requestHeaders['X-AUTHENTICATION-TOKEN'], token, 'Ember.SimpleAuth registers an AJAX prefilter that adds the authToken for non-crossdomain requests when authenticateAjax is true.');

  xhrMock = XhrMock.create();
  xhrMock.crossDomain = true;
  registeredAjaxPrefilter({}, {}, xhrMock);
  equal(xhrMock.requestHeaders['X-AUTHENTICATION-TOKEN'], undefined, 'Ember.SimpleAuth registers an AJAX prefilter that does not add the authToken for crossdomain requests when authenticateAjax is true.');

  Ember.$.ajaxPrefilter = originalPrefilter;
});
