/* jshint expr:true */
import { expect } from 'chai';
import { it } from 'mocha';
import { describeModule } from 'ember-mocha';

describeModule('route:application', 'ApplicationRoute', {
  needs: ['service:session', 'router:main']
}, function() {
  it('is still testable when using the ApplicationRouteMixin', function() {
    const route = this.subject();

    expect(route).to.be.ok;
  });
});
