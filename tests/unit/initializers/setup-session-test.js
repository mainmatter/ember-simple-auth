/* jshint expr:true */
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import setupSession from 'ember-simple-auth/initializers/setup-session';
import InternalSession from 'ember-simple-auth/internal-session';
import Configuration from 'ember-simple-auth/configuration';

describe('setupSession', () => {
  let registry;

  beforeEach(() => {
    registry = {
      register() {},
      injection() {}
    };
  });

  it('registers the session', () => {
    sinon.spy(registry, 'register');
    setupSession(registry);

    expect(registry.register).to.have.been.calledWith('session:main', InternalSession);
  });

  it('injects the session store into the session', () => {
    sinon.spy(registry, 'injection');
    setupSession(registry);

    expect(registry.injection).to.have.been.calledWith('session:main', 'store', Configuration.store);
  });
});
