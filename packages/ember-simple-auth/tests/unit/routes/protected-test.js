import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('ProtectedRoute', function() {
  setupTest();

  it('is still testable when using the AuthenticatedRouteMixin', function() {
    const route = this.owner.lookup('route:protected');

    expect(route).to.be.ok;
  });
});
