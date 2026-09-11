import { module, test } from 'qunit';
import Configuration from 'ember-simple-auth/configuration';

module('Configuration', function (hooks) {
  hooks.afterEach(function () {
    Configuration.load({});
  });

  module('rootURL', function () {
    test('defaults to ""', function (assert) {
      Configuration.load({});

      assert.equal(Configuration.rootURL, '');
    });
  });

  module('routeAfterAuthentication', function () {
    test('defaults to "index"', function (assert) {
      Configuration.load({});

      assert.equal(Configuration.routeAfterAuthentication, 'index');
    });
  });

  module('useResolver', function () {
    test('defaults to true', function (assert) {
      Configuration.load({});

      assert.true(Configuration.useResolver);
    });
  });

  module('.load', function () {
    test('sets rootURL correctly', function (assert) {
      Configuration.load({ rootURL: '/rootURL' });

      assert.equal(Configuration.rootURL, '/rootURL');
    });

    test('sets routeAfterAuthentication correctly', function (assert) {
      Configuration.load({ routeAfterAuthentication: '/some-route' });

      assert.equal(Configuration.routeAfterAuthentication, '/some-route');
    });

    test('sets useResolver correctly', function (assert) {
      Configuration.load({ useResolver: false });

      assert.false(Configuration.useResolver);
    });
  });
});
