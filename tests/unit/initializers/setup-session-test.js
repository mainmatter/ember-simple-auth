/* jshint expr:true */
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import setupSession from 'ember-simple-auth/initializers/setup-session';
import Session from 'ember-simple-auth/session';
import Configuration from 'ember-simple-auth/configuration';

let registry;

describe('setupSession', () => {
  beforeEach(() => {
    registry = {
      register() {},
      injection() {}
    };
  });

  it('registers the session', () => {
    sinon.spy(registry, 'register');
    setupSession(registry);

    expect(registry.register).to.have.been.calledWith('simple-auth-session:main', Session);
  });

  it('injects the session store into the session', () => {
    sinon.spy(registry, 'injection');
    setupSession(registry);

    expect(registry.injection).to.have.been.calledWith('simple-auth-session:main', 'store', Configuration.base.store);
  });

  it('injects a custom session store if configured', () => {
    Configuration.base.store = 'session-store:ephemeral';
    sinon.spy(registry, 'injection');
    setupSession(registry);

    expect(registry.injection).to.have.been.calledWith('simple-auth-session:main', 'store', 'session-store:ephemeral');
  });
});
