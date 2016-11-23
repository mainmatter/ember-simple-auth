/* jshint expr:true */
import { expect } from 'chai';
import { it } from 'mocha';
import { describeModule } from 'ember-mocha';

describeModule('route:protected', 'ProtectedRoute', {
  needs: ['router:main']
}, function() {
  it('is still testable when using the AuthenticatedRouteMixin', function() {
    const route = this.subject();

    expect(route).to.be.ok;
  });
});
