import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Configuration from 'ember-simple-auth/configuration';

module('Configuration', function(hooks) {
  hooks.afterEach(function() {
    Configuration.load({});
  });

  module('rootURL', function(hooks) {
    test('defaults to ""', function(assert) {
      Configuration.load({});

      assert.equal(Configuration.rootURL, '');
    });
  });

  module('routeAfterAuthentication', function(hooks) {
    test('defaults to "index"', function(assert) {
      Configuration.load({});

      assert.equal(Configuration.routeAfterAuthentication, 'index');
    });
  });

  module('.load', function(hooks) {
    test('sets rootURL correctly', function(assert) {
      Configuration.load({ rootURL: '/rootURL' });

      assert.equal(Configuration.rootURL, '/rootURL');
    });

    test('sets routeAfterAuthentication correctly', function(assert) {
      Configuration.load({ routeAfterAuthentication: '/some-route' });

      assert.equal(Configuration.routeAfterAuthentication, '/some-route');
    });
  });
});
