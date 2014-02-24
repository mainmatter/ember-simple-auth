import { Core } from 'ember-simple-auth/core';
import { Session } from 'ember-simple-auth/session';
import { Authenticators } from 'ember-simple-auth/authenticators';
import { Stores } from 'ember-simple-auth/stores';

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

module('Core', {
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
  Core.setup(containerMock, applicationMock, { authenticationRoute: 'somewhere' });

  equal(Core.authenticationRoute, 'somewhere', 'Core assigns authenticationRoute when specified for setup.');
});

test('assigns the route after authentication', function() {
  Core.setup(containerMock, applicationMock, { routeAfterAuthentication: 'somewhere' });

  equal(Core.routeAfterAuthentication, 'somewhere', 'Core assigns routeAfterAuthentication when specified for setup.');
});

test('assigns the route after session invalidation', function() {
  Core.setup(containerMock, applicationMock, { routeAfterInvalidation: 'somewhere' });

  equal(Core.routeAfterInvalidation, 'somewhere', 'Core assigns routeAfterInvalidation when specified for setup.');
});

test('registers the OAuth2 authenticator with the container', function() {
  Core.setup(containerMock, applicationMock);
  var injection = containerMock.lookup('ember-simple-auth:authenticators:oauth2');

  equal(injection.factory, Authenticators.OAuth2, 'Core registers the OAuth2 authenticator.');
});

test('injects the session in models, views, controllers and routes', function() {
  Core.setup(containerMock, applicationMock);

  Ember.$.each(['model', 'view', 'controller', 'view'], function(i, component) {
    var injection = Ember.$.grep(containerMock.injections, function(injection) {
      return injection.target === component;
    })[0];

    equal(injection.object.constructor, Session, 'Core injects the session into ' + component + '.');
    equal(injection.property, 'session', 'Core makes the session available as "session" in ' + component + '.');
  });
});

test('assigns the store and container to the session', function() {
  Core.setup(containerMock, applicationMock, { store: Stores.Ephemeral });

  var session = containerMock.injections[0].object;

  equal(session.container, containerMock, 'Core assigns the container to the session.');
  equal(session.store.constructor, Stores.Ephemeral, 'Core assigns the correct store to the session.');
});

test('registers an AJAX prefilter that authorizes requests', function() {
  Core.setup(containerMock, applicationMock, { authorizer: AuthorizerMock });

  ajaxPrefilterMock.registeredAjaxPrefilter({ url: '/some' }, {}, {});
  ok(authorizerMock.authorized, "Core registers an AJAX prefilter that authorizes requests that go to the application's origin.");

  authorizerMock.authorized = false;
  ajaxPrefilterMock.registeredAjaxPrefilter({ url: 'https://a.different.domain:1234' }, {}, {});
  ok(!authorizerMock.authorized, 'Core registers an AJAX prefilter that does not authorize cross-origin requests.');

  Core.setup(containerMock, applicationMock, { crossOriginWhitelist: ['https://a.different.domain:1234'], authorizer: AuthorizerMock, store: Stores.Ephemeral });
  ajaxPrefilterMock.registeredAjaxPrefilter({ url: 'https://a.different.domain:1234' }, {}, {});
  ok(authorizerMock.authorized, 'Core registers an AJAX prefilter that authorizes cross-origin requests when the origin is in the crossOriginWhitelist.');

  Core.setup(containerMock, applicationMock, { crossOriginWhitelist: ['http://a.different.domain'], authorizer: AuthorizerMock, store: Stores.Ephemeral });
  ajaxPrefilterMock.registeredAjaxPrefilter({ url: 'http://a.different.domain:80' }, {}, {});
  ok(authorizerMock.authorized, 'Core registers an AJAX prefilter that authorizes cross-origin requests when the origin is in the crossOriginWhitelist where default ports can be left out.');
});
