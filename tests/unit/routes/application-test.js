import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('ApplicationRoute', function() {
  setupTest('route:application', {
    needs: ['service:session', 'router:main', 'service:session-account']
  });

  it('is still testable when using the ApplicationRouteMixin', function() {
    const route = this.subject();

    expect(route).to.be.ok;
  });
});
