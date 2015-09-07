/* jshint expr:true */
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import setupSessionStores from 'ember-simple-auth/initializers/setup-session-stores';
import LocalStorageStore from 'ember-simple-auth/stores/local-storage';
import CookieStore from 'ember-simple-auth/stores/cookie';
import EphemeralStore from 'ember-simple-auth/stores/ephemeral';

describe('setupSessionStores', () => {
  let registry;

  beforeEach(() => {
    registry = {
      register() {}
    };
    sinon.spy(registry, 'register');
    setupSessionStores(registry);
  });

  it('registers the localStorage store', () => {
    expect(registry.register).to.have.been.calledWith('session-store:local-storage', LocalStorageStore);
  });

  it('registers the cookie store', () => {
    expect(registry.register).to.have.been.calledWith('session-store:cookie', CookieStore);
  });

  it('registers the ephemeral store', () => {
    expect(registry.register).to.have.been.calledWith('session-store:ephemeral', EphemeralStore);
  });
});
