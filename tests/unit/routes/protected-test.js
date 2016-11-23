/* jshint expr:true */
import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('ProtectedRoute', function() {
  setupTest('route:protected', {
    needs: ['router:main']
  });

  it('is still testable when using the AuthenticatedRouteMixin', function() {
    const route = this.subject();

    expect(route).to.be.ok;
  });
});
