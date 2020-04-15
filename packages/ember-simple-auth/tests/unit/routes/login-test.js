import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('LoginRoute', function() {
  setupTest();

  it('is still testable when using the UnauthenticatedRouteMixin', function() {
    const route = this.owner.lookup('route:login');

    expect(route).to.be.ok;
  });
});
