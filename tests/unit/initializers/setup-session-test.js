/* jshint expr:true */
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import setupSession from 'ember-simple-auth/initializers/setup-session';
import Session from 'ember-simple-auth/session';

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

    expect(registry.injection).to.have.been.calledWith('simple-auth-session:main', 'store', 'session-store:application');
  });
});
