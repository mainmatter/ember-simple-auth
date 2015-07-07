/* jshint expr:true */
import { it } from 'ember-mocha';
import Ember from 'ember';
import setupSessionService from 'ember-simple-auth/initializers/setup-session-service';

let registry;

describe('setupSessionService', () => {
  beforeEach(() => {
    registry = {
      injection() {}
    };
  });

  it('injects the session into the session service', () => {
    sinon.spy(registry, 'injection');
    setupSessionService(registry);

    expect(registry.injection).to.have.been.calledWith('service', 'session', 'simple-auth-session:main');
  });
});
