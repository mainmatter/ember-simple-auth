/* eslint-disable ember/no-mixins, ember/no-new-mixins */

import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

module('ProtectedRoute', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('route:protected', Route.extend(AuthenticatedRouteMixin));
  });

  test('is still testable when using the AuthenticatedRouteMixin', function(assert) {
    const route = this.owner.lookup('route:protected');

    assert.ok(route);
  });
});
