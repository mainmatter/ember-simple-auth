import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import setupSessionService from 'ember-simple-auth/initializers/setup-session-service';

describe('setupSessionService', () => {
  let registry;

  beforeEach(function() {
    registry = {
      injection() {}
    };
  });

  it('injects the session into the session service', function() {
    sinon.spy(registry, 'injection');
    setupSessionService(registry);

    expect(registry.injection).to.have.been.calledWith('service:session', 'session', 'session:main');
  });
});
