import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('ApplicationRoute', function() {
  setupTest();

  it('is still testable when using the ApplicationRouteMixin', function() {
    const route = this.owner.lookup('route:application');

    expect(route).to.be.ok;
  });
});
