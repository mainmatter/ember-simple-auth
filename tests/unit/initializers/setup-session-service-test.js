/* jshint expr:true */
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
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

    expect(registry.injection).to.have.been.calledWith('service:session', 'session', 'simple-auth-session:main');
  });
});
