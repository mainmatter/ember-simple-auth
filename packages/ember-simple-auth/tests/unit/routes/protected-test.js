/* eslint-disable ember/no-mixins, ember/no-new-mixins */

import { expect } from 'chai';
import { it, describe, beforeEach } from 'mocha';
import { setupTest } from 'ember-mocha';
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

describe('ProtectedRoute', function() {
  setupTest();

  beforeEach(function() {
    this.owner.register('route:protected', Route.extend(AuthenticatedRouteMixin));
  });

  it('is still testable when using the AuthenticatedRouteMixin', function() {
    const route = this.owner.lookup('route:protected');

    expect(route).to.be.ok;
  });
});
