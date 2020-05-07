import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinonjs from 'sinon';
import setupSessionService from 'ember-simple-auth/initializers/setup-session-service';

describe('setupSessionService', () => {
  let sinon;
  let registry;

  beforeEach(function() {
    sinon = sinonjs.createSandbox();
    registry = {
      injection() {}
    };
  });

  afterEach(function() {
    sinon.restore();
  });

  it('injects the session into the session service', function() {
    sinon.spy(registry, 'injection');
    setupSessionService(registry);

    expect(registry.injection).to.have.been.calledWith('service:session', 'session', 'session:main');
  });
});
