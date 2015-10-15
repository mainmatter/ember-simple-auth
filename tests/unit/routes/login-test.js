/* jshint expr:true */
import { expect } from 'chai';
import { describeModule, it } from 'ember-mocha';

describeModule('route:login', 'LoginRoute', {
  needs: ['router:main']
}, function() {
  it('is still testable when using the UnauthenticatedRouteMixin', function() {
    const route = this.subject();

    expect(route).to.be.ok;
  });
});
