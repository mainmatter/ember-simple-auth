/* eslint-disable ember/no-mixins, ember/no-new-mixins */

import { expect } from 'chai';
import { it, describe, beforeEach } from 'mocha';
import { setupTest } from 'ember-mocha';
import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

describe('LoginRoute', function() {
  setupTest();

  beforeEach(function() {
    this.owner.register('route:login', Route.extend(UnauthenticatedRouteMixin));
  });

  it('is still testable when using the UnauthenticatedRouteMixin', function() {
    const route = this.owner.lookup('route:login');

    expect(route).to.be.ok;
  });
});
