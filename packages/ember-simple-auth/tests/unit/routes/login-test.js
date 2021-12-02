/* eslint-disable ember/no-mixins, ember/no-new-mixins */

import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

module('LoginRoute', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('route:login', Route.extend(UnauthenticatedRouteMixin));
  });

  test('is still testable when using the UnauthenticatedRouteMixin', function(assert) {
    const route = this.owner.lookup('route:login');

    assert.ok(route);
  });
});
