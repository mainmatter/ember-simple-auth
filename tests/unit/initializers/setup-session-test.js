import Ember from 'ember';
import {
  describe,
  beforeEach,
  afterEach,
  it
} from 'mocha';
import { expect } from 'chai';
import sinonjs from 'sinon';
import setupSession from 'ember-simple-auth/initializers/setup-session';
import Ephemeral from 'ember-simple-auth/session-stores/ephemeral';
import InternalSession from 'ember-simple-auth/internal-session';

describe('setupSession', () => {
  let sinon;
  let registry;

  beforeEach(function() {
    sinon = sinonjs.sandbox.create();
    registry = {
      register() {},
      injection() {}
    };
    Ember.testing = true;
  });

  afterEach(function() {
    sinon.restore();
  });

  it('registers the session', function() {
    sinon.spy(registry, 'register');
    setupSession(registry);

    expect(registry.register).to.have.been.calledWith('session:main', InternalSession);
  });

  describe('when Ember.testing is true', function() {
    it('registers the test session store', function() {
      sinon.spy(registry, 'register');
      setupSession(registry);

      expect(registry.register).to.have.been.calledWith('session-store:test', Ephemeral);
    });

    it('injects the test session store into the session', function() {
      sinon.spy(registry, 'injection');
      setupSession(registry);

      expect(registry.injection).to.have.been.calledWith('session:main', 'store', 'session-store:test');
    });
  });

  describe('when Ember.testing is false', function() {
    beforeEach(function() {
      Ember.testing = false;
    });

    afterEach(function() {
      Ember.testing = true;
    });

    it('injects the application session store into the session', function() {
      sinon.spy(registry, 'injection');
      setupSession(registry);

      expect(registry.injection).to.have.been.calledWith('session:main', 'store', 'session-store:application');
    });
  });
});
