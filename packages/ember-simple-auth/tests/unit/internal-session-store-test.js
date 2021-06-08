import Ember from 'ember';
import { describe, beforeEach, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import { expect } from 'chai';
import sinonjs from 'sinon';
import InternalSession from 'ember-simple-auth/internal-session';
import EphemeralStore from 'ember-simple-auth/session-stores/ephemeral';

describe('InternalSession store injection', () => {
  setupTest();

  let sinon;
  let session;

  beforeEach(function() {
    sinon = sinonjs.createSandbox();
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('session store injection', function() {
    afterEach(function() {
      Ember.testing = true; // eslint-disable-line ember/no-ember-testing-in-module-scope
    });

    it('looks up the test session store when Ember.testing true', function() {
      Ember.testing = true; // eslint-disable-line ember/no-ember-testing-in-module-scope

      this.owner.register('session-store:test', EphemeralStore);
      session = InternalSession.create(this.owner.ownerInjection());

      expect(session.get('store')).to.eql(this.owner.lookup('session-store:test'));
    });

    it('looks up the application session store when Ember.testing false', function() {
      Ember.testing = false; // eslint-disable-line ember/no-ember-testing-in-module-scope
      sinon = sinonjs.createSandbox();

      this.owner.register('session-store:test', EphemeralStore);
      session = InternalSession.create(this.owner.ownerInjection());

      expect(session.get('store')).to.eql(this.owner.lookup('session-store:application'));
    });
  });
});
