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

var authorizerMock;
var AuthorizerMock = Ember.Object.extend({
  authorize: function() {
    this.authorized = true;
  }
});
AuthorizerMock.reopenClass({
  create: function(options) {
    return (authorizerMock = this._super(options));
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
    applicationMock       = ApplicationMock.create();
    ajaxPrefilterMock     = AjaxPrefilterMock.create();
    Ember.$.ajaxPrefilter = Ember.$.proxy(ajaxPrefilterMock.ajaxPrefilterCapture, ajaxPrefilterMock);
  },
  teardown: function() {
    Ember.$.ajaxPrefilter = this.originalAjaxPrefilter;
    Ember.run.cancel(Ember.SimpleAuth.Session._syncPropertiesTimeout);
  }
});

test('assigns the login route', function() {
  Ember.SimpleAuth.setup(applicationMock, { authenticationRoute: 'somewhere' });

  equal(Ember.SimpleAuth.authenticationRoute, 'somewhere', 'Ember.SimpleAuth assigns authenticationRoute when specified for setup.');
});

test('assigns the route after login', function() {
  Ember.SimpleAuth.setup(applicationMock, { routeAfterAuthentication: 'somewhere' });

  equal(Ember.SimpleAuth.routeAfterAuthentication, 'somewhere', 'Ember.SimpleAuth assigns routeAfterAuthentication when specified for setup.');
});

test('assigns the route after logout', function() {
  Ember.SimpleAuth.setup(applicationMock, { routeAfterInvalidation: 'somewhere' });

  equal(Ember.SimpleAuth.routeAfterInvalidation, 'somewhere', 'Ember.SimpleAuth assigns routeAfterInvalidation when specified for setup.');
});

test('injects the session in models, views, controllers and routes', function() {
  Ember.SimpleAuth.setup(applicationMock);

  Ember.$.each(['model', 'view', 'controller', 'view'], function(i, component) {
    var injection = Ember.$.grep(applicationMock.injections, function(injection) {
      return injection.target === component;
    })[0];

    equal(injection.property, 'session', 'Ember.SimpleAuth makes the session available as "session" in ' + component + '.');
    equal(injection.object.constructor, Ember.SimpleAuth.Session, 'Ember.SimpleAuth injects the session into ' + component + '.');
  });
});

test('registers an AJAX prefilter that authorizes requests', function() {
  Ember.SimpleAuth.setup(applicationMock, { authorizer: AuthorizerMock });

  ajaxPrefilterMock.registeredAjaxPrefilter({}, {}, {});
  ok(authorizerMock.authorized, 'Ember.SimpleAuth registers an AJAX prefilter that authorizes same-origin requests.');

  authorizerMock.authorized = false;
  ajaxPrefilterMock.registeredAjaxPrefilter({ url: 'https://a.different.domain:1234' }, {}, {});
  ok(!authorizerMock.authorized, 'Ember.SimpleAuth registers an AJAX prefilter that does not authorize cross-origin requests.');

  Ember.SimpleAuth.setup(applicationMock, { crossOriginWhitelist: ['https://a.different.domain:1234'], authorizer: AuthorizerMock, store: Ember.SimpleAuth.Stores.Ephemeral });
  ajaxPrefilterMock.registeredAjaxPrefilter({ url: 'https://a.different.domain:1234' }, {}, {});
  ok(authorizerMock.authorized, 'Ember.SimpleAuth registers an AJAX prefilter that authorizes cross-origin requests when the origin is in the crossOriginWhitelist.');
});
