import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('LoginRoute', function() {
  setupTest('route:login', {
    needs: ['router:main', 'service:session']
  });

  it('is still testable when using the UnauthenticatedRouteMixin', function() {
    const route = this.subject();

    expect(route).to.be.ok;
  });
});
