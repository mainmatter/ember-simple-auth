/* eslint-disable ember/no-mixins, ember/no-new-mixins */

import { expect } from 'chai';
import { it, describe, beforeEach } from 'mocha';
import { setupTest } from 'ember-mocha';
import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

describe('ApplicationRoute', function() {
  setupTest();

  beforeEach(function() {
    this.owner.register('route:application', Route.extend(ApplicationRouteMixin));
  });

  it('is still testable when using the ApplicationRouteMixin', function() {
    const route = this.owner.lookup('route:application');

    expect(route).to.be.ok;
  });
});
