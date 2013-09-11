var testRoute = Ember.Object.extend(Ember.SimpleAuth.LogoutRouteMixin, {
  session: Ember.SimpleAuth.Session.create(),
  route:   null,

  transitionToRoute: function(targetRoute) {
    this.route = targetRoute;
  }
}).create();

var ajaxRequestOptions;
var ajaxMock = function(options) {
  ajaxRequestOptions = options;
  return {
    always: function(callback) {
      callback();
    }
  };
};

module('Ember.SimpleAuth.LogoutRouteMixin', {
  originalAjax: Ember.$.ajax,
  setup: function() {
    Ember.$.ajax = ajaxMock;
  },
  teardown: function() {
    Ember.$.ajax = this.originalAjax;
  }
});

test('it sends a DELETE request to the /session route before model', function() {
  Ember.SimpleAuth.baseUrl = '';
  testRoute.beforeModel();

  equal(ajaxRequestOptions.url, '/session', 'Ember.SimpleAuth.LogoutRouteMixin sends a DELETE request to the /session route before model.');
  equal(ajaxRequestOptions.type, 'DELETE', 'Ember.SimpleAuth.LogoutRouteMixin sends a DELETE request to the /session route before model.');

  Ember.SimpleAuth.baseUrl = '/some/other/base';
  testRoute.beforeModel();

  equal(ajaxRequestOptions.url, '/some/other/base/session', 'Ember.SimpleAuth.LogoutRouteMixin sends a DELETE request to the correct route before model if a basePath is defined.');
});
