import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinonjs from 'sinon';
import { setupTest } from 'ember-mocha';

describe('setupSessionService', () => {
  setupTest();
  let sinon;

  beforeEach(function() {
    sinon = sinonjs.createSandbox();
  });

  afterEach(function() {
    sinon.restore();
  });

  it('injects the session into the session service', function() {
    expect(this.owner.lookup('service:session').session).eq(this.owner.lookup('session:main'));
  });
});
