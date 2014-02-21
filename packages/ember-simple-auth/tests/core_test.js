var containerMock;
var ContainerMock = Ember.Object.extend({
  init: function() {
    this.injections    = [];
    this.registrations = {};
  },
  register: function(name, factory, options) {
    this.registrations[name] = {
      factory: factory,
      options: options
    };
  },
  lookup: function(name) {
    return this.registrations[name];
  },
  injection: function(target, property, name) {
    var registration = this.lookup(name);
    if (registration) {
      this.injections.push({
        target:   target,
        property: property,
        object:   registration.factory
      });
    }
  }
});

var applicationMock;
var ApplicationMock = Ember.Object.extend({
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
    containerMock         = ContainerMock.create();
    applicationMock       = ApplicationMock.create();
    ajaxPrefilterMock     = AjaxPrefilterMock.create();
    Ember.$.ajaxPrefilter = Ember.$.proxy(ajaxPrefilterMock.ajaxPrefilterCapture, ajaxPrefilterMock);
  },
  teardown: function() {
    Ember.$.ajaxPrefilter = this.originalAjaxPrefilter;
  }
});

test('assigns the authentication route', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock, { authenticationRoute: 'somewhere' });

  equal(Ember.SimpleAuth.authenticationRoute, 'somewhere', 'Ember.SimpleAuth assigns authenticationRoute when specified for setup.');
});

test('assigns the route after authentication', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock, { routeAfterAuthentication: 'somewhere' });

  equal(Ember.SimpleAuth.routeAfterAuthentication, 'somewhere', 'Ember.SimpleAuth assigns routeAfterAuthentication when specified for setup.');
});

test('assigns the route after session invalidation', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock, { routeAfterInvalidation: 'somewhere' });

  equal(Ember.SimpleAuth.routeAfterInvalidation, 'somewhere', 'Ember.SimpleAuth assigns routeAfterInvalidation when specified for setup.');
});

test('registers the OAuth2 authenticator', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock);

  var injection = containerMock.lookup('ember-simple-auth:authenticators:oauth2');
  equal(injection.factory, Ember.SimpleAuth.Authenticators.OAuth2, 'Ember.SimpleAuth registers the OAuth2 authenticator.');
});

test('injects the session in models, views, controllers and routes', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock);

  Ember.$.each(['model', 'view', 'controller', 'view'], function(i, component) {
    var injection = Ember.$.grep(containerMock.injections, function(injection) {
      return injection.target === component;
    })[0];

    equal(injection.object.constructor, Ember.SimpleAuth.Session, 'Ember.SimpleAuth injects the session into ' + component + '.');
    equal(injection.property, 'session', 'Ember.SimpleAuth makes the session available as "session" in ' + component + '.');
  });
});

test('assigns the store and container to the session', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock, { store: Ember.SimpleAuth.Stores.Ephemeral });

  var session = containerMock.injections[0].object;

  equal(session.container, containerMock, 'Ember.SimpleAuth assigns the container to the session.');
  equal(session.store.constructor, Ember.SimpleAuth.Stores.Ephemeral, 'Ember.SimpleAuth assigns the correct store to the session.');
});

test('registers an AJAX prefilter that authorizes requests', function() {
  Ember.SimpleAuth.setup(containerMock, applicationMock, { authorizer: AuthorizerMock });

  ajaxPrefilterMock.registeredAjaxPrefilter({ url: 'some' }, {}, {});
  ok(authorizerMock.authorized, "Ember.SimpleAuth registers an AJAX prefilter that authorizes requests that fo the the application's origin.");

  authorizerMock.authorized = false;
  ajaxPrefilterMock.registeredAjaxPrefilter({ url: 'https://a.different.domain:1234' }, {}, {});
  ok(!authorizerMock.authorized, 'Ember.SimpleAuth registers an AJAX prefilter that does not authorize cross-origin requests.');

  Ember.SimpleAuth.setup(containerMock, applicationMock, { crossOriginWhitelist: ['https://a.different.domain:1234'], authorizer: AuthorizerMock, store: Ember.SimpleAuth.Stores.Ephemeral });
  ajaxPrefilterMock.registeredAjaxPrefilter({ url: 'https://a.different.domain:1234' }, {}, {});
  ok(authorizerMock.authorized, 'Ember.SimpleAuth registers an AJAX prefilter that authorizes cross-origin requests when the origin is in the crossOriginWhitelist.');

  Ember.SimpleAuth.setup(containerMock, applicationMock, { crossOriginWhitelist: ['http://a.different.domain'], authorizer: AuthorizerMock, store: Ember.SimpleAuth.Stores.Ephemeral });
  ajaxPrefilterMock.registeredAjaxPrefilter({ url: 'http://a.different.domain:80' }, {}, {});
  ok(authorizerMock.authorized, 'Ember.SimpleAuth registers an AJAX prefilter that authorizes cross-origin requests when the origin is in the crossOriginWhitelist where default ports can be left out.');
});
