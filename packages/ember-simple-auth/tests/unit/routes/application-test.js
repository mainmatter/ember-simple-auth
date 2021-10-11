/* eslint-disable ember/no-mixins, ember/no-new-mixins */

import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

module('ApplicationRoute', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('route:application', Route.extend(ApplicationRouteMixin));
  });

  test('is still testable when using the ApplicationRouteMixin', function(assert) {
    const route = this.owner.lookup('route:application');

    assert.ok(route);
  });
});
